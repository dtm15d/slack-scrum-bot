let data = require('@architect/data')
let ScrumBot = require('@architect/shared/scrumbot')

exports.handler = async (event, context, callback) => {
  /**
   * Event Object:
   * {
      "type": "interactive_message",
      "actions": [
        {
          "name": "save",
          "type": "button",
          "value": "save"
        }
      ],
      "callback_id": "confirm_scrum",
      "team": {
        "id": "TCRCVH6BG",
        "domain": "clubwin"
      },
      "channel": {
        "id": "CEDLMAJLF",
        "name": "scrum-team-a"
      },
      "user": {
        "id": "UCPF52WNM",
        "name": "dtm15d"
      },
      "action_ts": "1543650195.575757",
      "message_ts": "1543650193.003000",
      "attachment_id": "1",
      "token": "q1ApjBI3iasq3DMkrD1lbrxc",
      "is_app_unfurl": false,
      "response_url": "https://hooks.slack.com/actions/TCRCVH6BG/494343009206/NbTWqTYHHm92GaVs1ksSBh7U",
      "trigger_id": "493140943557.433437584390.3e630d6e30a48ce8ae49da1d76d6c6dd"
      }
   */
    if ("start_scrum" == event.callback_id) 
    {
      ScrumBot.initSCRUMUopdates( {
        channel: event.channel.id,
        teamID: event.team.id, 
        channelName : event.channel.name
      } )
      
      callback(null, 
        {
          response_type: "in_channel",
          text: 'Please provide your SCRUM update:',
          attachments: [{
            text: "SCRUM Started",
            fallback: 'SCRUM started',
            color: '#eheheh'
          }]
        }
      )    
    } 
    else if ("provide_scrum_update" == event.callback_id) 
    {
      if ("start" == event.actions[0].name) 
      {
        await ScrumBot.getSCRUMUpdate({ trigger_id: event.trigger_id, scrumID: event.actions[0].value })
        callback(null, {text:'in progress...'})
      } else {
        await ScrumBot.incrementSCRUMSubmission({ scrumID: event.actions[0].value })
        callback(null, {text:'Thank you, You have skipped todays SCRUM.'})
      }      
    }
    else if ("user_scrum_update" == event.callback_id) 
    {
      /**
{
    "type": "dialog_submission",
    "token": "q1ApjBI3iasq3DMkrD1lbrxc",
    "action_ts": "1543799200.459550",
    "team": {
        "id": "TCRCVH6BG",
        "domain": "clubwin"
    },
    "user": {
        "id": "UCPF52WNM",
        "name": "dtm15d"
    },
    "channel": {
        "id": "CEDLMAJLF",
        "name": "scrum-team-a"
    },
    "submission": {
        "yesterday": "a",
        "today": "b",
        "blockers": "c"
    },
    "callback_id": "user_scrum_update",
    "response_url": "https://hooks.slack.com/app/TCRCVH6BG/494882970870/Sv5kY5itVixPvq9VZPX7RyW2",
    "state": "initial"
}
       */
      let scrumID = event.state

      await ScrumBot.incrementSCRUMSubmission({scrumID})

      //save our response.
      let newScrumResponse = {
        scrumID,
        responseID: ScrumBot.getID(),
        channelID: event.channel.id,
        userID: event.user.id,
        userName: event.user.name,
        yesterday: event.submission.yesterday,
        today: event.submission.today,
        blockers: event.submission.blockers
      }

      let saveResp = await data.scrumResponses.put(newScrumResponse)

      await ScrumBot.postSCRUMUpdates({scrumID, postInprogress: false })
      
      callback(null, {})
    }
    // console.log(JSON.stringify(event, null, 2))
}
