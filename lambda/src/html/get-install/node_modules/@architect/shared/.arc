# this is an .arc file!
@app
scrum-bot

@html
get /        # displays Add to Slack
get /install # saves a bot token and redirects back to /
get /signin  # saves a user token and redirects back to /

@slack
bot          # sets up slack api urls

@tables

# Table for our scrums
# scrumID - uniquid for scrum
# channelId - channel reference for slack
# dayOfWeek - days of week for scrum
# timeOfDay - time of day for scrum
scrums
  scrumID *String

# Table for scrum responses
# responseId - for each response from a user
# scrumsId - ref to scrum group
# userId - slack user ref
# update {
#    yesterday
#    today
#    blockers
# }
scrumResponses
  responseID *String