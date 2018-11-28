# this is an .arc file!
@app
scrum-bot
@html
get /        # displays Add to Slack
get /install # saves a bot token and redirects back to /
get /signin  # saves a user token and redirects back to /
@slack
bot          # sets up slack api urls