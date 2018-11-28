/**
 * Slash Commands are used for users configur SCRUM on a specific channel.
 * 
 */

exports.handler = function slash(event, context, callback) {
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
   */
  var scrumConfigInstructions = 'Available Commands:\n' +
  '\t/scrumbot setup [scrum-time HH:MM GMT-0400]\n' +
  '\t\t#Configure SCRUM for this channel to start M-F at certain time. \n' +
  '\t\t#Time format should be military time with timezone specified relative to GMT.\n' +
  '\t/scrumbot info\n'+
  '\t\t#Print SCRUM configuration';
  
  /**
   * /scrumbot setup hh:mm
   * Configure scrum for a specific time weekly
   */
  if (event.text.indexOf("setup") == 0)
  {
//TODO support timezones better
    //setup config.
    var config = event.text.split(' ');
    if (config.length == 3)
    {
      var datetime = new Date('1970-01-01 ' + config[1] + ' ' + config[2]);
      callback(null, {
        text: 'Confirm SCRUM configuration?',
        attachments: [{
          text: "M-F @ " + datetime.toTimeString(),
          fallback: 'Confirm scrum configuration',
          callback_id: 'confirm_scrum',
          color: '#eheheh',
          actions: [{
            name: 'save',
            text: 'Save',
            type: 'button',
            value: 'save'
          }]
        }]
      })

    } else {
      callback(null, {
        text: 'Invalid setup.\n' + scrumConfigInstructions
      })
    }
  } 
  
  /**
   * /scrumbot info
   * Print the information related to scrum configured on this channel.
   */
  else if ("info" == event.text) {
    callback(null, {
      text: 'SCRUM not configured.'
    })
  }
  callback(null, {
    text:
    'Invalid command.\n' + scrumConfigInstructions
  })
  
}
