let data = require('@architect/data')
const token = "123"
let slack = require('slack')

/**
 * SCRUM bot
 */

const ScrumBot = {

  /**
   * Get Random Unique ID
   * @returns string
   */
  getID: () => {
    let length = 12
    let radom13chars = function () {
          return Math.random().toString(16).substring(2, 15)
      }
      let loops = Math.ceil(length / 13)
      return new Array(loops).fill(radom13chars).reduce((string, func) => {
          return string + func()
      }, '').substring(0, length)
  },

  /**
   * Get last active SCRUM ID
   */
  getLastSCRUMID: () => {
      return "4461d898c5a9"
  },
  
  /**
   * Post SCRUM Updates to slack
   */
  postSCRUMUpdates: async ({ scrumID, postInprogress, callback }) => {
    //load our SCRUM
    console.log("postSCRUMUpdates.scrumID:" + scrumID) 
    let scrumResultSet = await data.scrums.query({
      KeyConditionExpression: 'scrumID = :scrumID',
      ExpressionAttributeValues: {
        ':scrumID': scrumID
      }
    })
    //Print our SCRUM SET
    console.log(JSON.stringify(scrumResultSet, null, 2))
    if (scrumResultSet && scrumResultSet.Items && scrumResultSet.Items.length == 1)
    {
      let scrum = scrumResultSet.Items[0];
      if (scrum.membersResponded == scrum.totalMembers || postInprogress)
      {
          let channel = scrum.channelId;
          let inProgress = (scrum.membersResponded === scrum.totalMembers)
          var attachments = []
          attachments.push({
            fallback: "Report Status: " + (inProgress == true ? "In Progress" : "Complete"),
            color: (inProgress == true ? "#ffff00" : "#2eb886"),
            title: "Report Status",
            text: (inProgress == true ? "In Progress" : "Complete"),            
          })
          //print our SCRUMS
          let scrumResults = await data.scrumResponses.query({
            KeyConditionExpression: 'scrumID = :scrumID',
            ExpressionAttributeValues: {
              ':scrumID': scrumID
            }
          })
          if (scrumResults && scrumResults.Items)
          {
            for (let index = 0; index < scrumResults.Items.length; index++) {
              const scrumDetails = scrumResults.Items[index];
              
              attachments.push({
                fallback: scrumDetails.userName + " Update",
                title: "User:",
                text: scrumDetails.userName,
                fields: [
                  {
                    title: "What did I do yesterday?",
                    value: scrumDetails.yesterday,
                    short: false
                  },
                  {
                    title: "What am I doing today?",
                    value: scrumDetails.today,
                    short: false
                  },
                  {
                    title: "Do I have any blockers?",
                    value: scrumDetails.blockers,
                    short: false
                  },
                ],
              })
              
            }
          }
          
          let msgConfig = {
            response_type: "in_channel",
            text: "SCRUM Report",
            attachments: attachments
          }
          if (callback)
          {
            console.log(JSON.stringify({...msgConfig, callback}, null, 2))
            callback(null, msgConfig)
          } else {
            slack.chat.postMessage({
              ...msgConfig,
              token, 
              channel            
            })
          }
      }
    } else {
      if (callback)
      {
        callback(null, {response_type: "ephemeral", text: "Error"})
      } else {
        slack.chat.postMessage({
          response_type: "ephemeral", 
          text: "Error",
          token, 
          channel
        })
      }
    }
  },
  
  /**
   * Init scrum updates for each user via private message to trigger dialog.
   */
  initSCRUMUopdates: async ({ channel, teamID, channelName }) => {
  
    let a = await slack.conversations.members({ token, channel })
    // console.log(JSON.stringify(a, null, 2))
    if (a.members.length > 0)
    {
      //First lets creat a new SCRUM
      let scrumID = ScrumBot.getID()
      let epoch = Date.now() - 1525066366572
      let scrum = { scrumID, epoch, channelId:channel, teamID, channelName, membersResponded: 0, totalMembers: a.members.length}
      let saveScrumR = await data.scrums.put(scrum)
  
      for (let index = 0; index <  a.members.length; index++) {
        const user =  a.members[index];
        //slack.chat.postEphemeral({token, channel, text, user})
        let c = await slack.chat.postEphemeral({ 
          token, 
          user,
          channel,
          text: "SCRUM has started.",
          attachments: [{
            text: "Provide your update:",
            fallback: 'Provide your update:',
            callback_id: 'provide_scrum_update',
            color: '#eheheh',
            actions: [{
              name: 'start',
              text: 'Start',
              type: 'button',
              value: scrumID
            },
            {
              name: 'skip',
              text: 'Skip',
              type: 'button',
              value: scrumID
            }]
          }]
        })
        
      }
    }
  },
  
  /**
   * Get SCRUM Update from user
   * Use is ready to lanch dialog and provide update.
   */
  getSCRUMUpdate: async ({ trigger_id, scrumID }) => {
    try {
      let r = await slack.dialog.open({
        token,
        trigger_id,
        dialog :
        {
          callback_id: "user_scrum_update",
          title: "Provide your update:",
          submit_label: "Save",
          state: scrumID,
          elements: [
            {
              type: "text",
              label: "WDYD yesterday?",
              name: "yesterday"
            },
            {
              type: "text",
              label: "WWYD today?",
              name: "today"
            },
            {
              type: "text",
              label: "Blockers?",
              name: "blockers"
            }
          ]
    
        }
      })
      console.log(JSON.stringify(r, null, 2))    
    } catch (error) {
      console.log(JSON.stringify(error, null, 2))    
    }
  },
  
  /**
   * Increase SCRUM Submission.
   */
  incrementSCRUMSubmission: async ({scrumID}) => {
  
    await data.scrums.update({
      Key: { scrumID },
      UpdateExpression: 'SET membersResponded = membersResponded + :newRes' ,
      ExpressionAttributeValues: {
        ':newRes': 1
      }
    })
  
  },
  
}

module.exports = ScrumBot