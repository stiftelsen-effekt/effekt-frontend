apt-get -q update &&
apt-get -qqy install xvfb libgtk2.0-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 nodejs npm &&
npm install &&
npm install -g gulp &&
npm build &&
npm test
