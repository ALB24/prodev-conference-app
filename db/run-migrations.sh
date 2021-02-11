echo $POSTGRES_PASSWORD
cd badges
npm run migrate -- up
sleep 1
# cd ../accounts
# npm run migrate -- up
# sleep 1
# cd ../presentations
# npm run migrate -- up
# sleep 1
# cd ../events
# npm run migrate -- up

