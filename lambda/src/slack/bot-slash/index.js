let ScrumBot = require('@architect/shared/scrumbot')

/**
 * Slash Commands are used for users configur SCRUM on a specific channel.
 * 
 */

exports.handler = async (event, context, callback) => {
  /**
   * Event Object:
   * {
        "token": "q1ApjBI3iasq3DMkrD1lbrxc",
        "team_id": "TCRCVH6BG",
        "team_domain": "clubwin",
        "channel_id": "CEDLMAJLF",
        "channel_name": "scrum-team-a",
        "user_id": "UCPF52WNM",
        "user_name": "dtm15d",
        "command": "/scrumbot",
        "text": "test",
        "response_url": "https://hooks.slack.com/commands/TCRCVH6BG/488974255744/GE9eSNtPzCUkxh8qp5egrIlN",
        "trigger_id": "488974255760.433437584390.bf10605ed0cf9293d021ca1ecd0892bb"
    }
  //  */
  // var scrumConfigInstructions = 'Available Commands:\n' +
  // '\t/scrumbot setup [scrum-time HH:MM GMT-0400]\n' +
  // '\t\t#Configure SCRUM for this channel to start M-F at certain time. \n' +
  // '\t\t#Time format should be military time with timezone specified relative to GMT.\n' +
  // '\t/scrumbot run\n' +
  // '\t\t#run SCRUM now.\n' +
  // '\t/scrumbot info\n'+
  // '\t\t#Print SCRUM configuration';

  var scrumConfigInstructions = 'Available Commands:\n' +
  '\t*/scrumbot run*\n' +
  '\t\t#run SCRUM now, get everyones updates/\n' +
  '\t*/scrumbot print*\n' +
  '\t\t#print SCRUM update..\n';
  
  /**
   * /scrumbot test
   * Test SCRUM
   */
  if ("run" == event.text) {
    callback(null, {
      response_type: "in_channel",
      text: 'Confirm run SCRUM in current channel?',
      attachments: [{
        text: "run scrum now",
        fallback: 'start scrum',
        callback_id: 'start_scrum',
        color: '#eheheh',
        actions: [{
          name: 'start',
          text: 'Start',
          type: 'button',
          value: 'start_scrum'
        }]
      }]
    })
  }
  
  /**
   * /scrumbot info
   * Print the information related to scrum configured on this channel.
   */
  else if ("print" == event.text) {
    await ScrumBot.postSCRUMUpdates({
        scrumID: await ScrumBot.getLastSCRUMID({ channelId : event.channel_id }), 
        postInprogress: true, 
        callback
      })    
  }
  else {
    callback(null, {
      text: 'Invalid command.\n' + scrumConfigInstructions
    })
  }

}
