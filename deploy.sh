SERVER_IP=95.85.23.66
SSH_PORT=10914
SSH_USER=sshUser
SERVER_APP_PATH="/home/claire/social-network"
APP_NAME=claire-social-network

deploy() {
  cd $SERVER_APP_PATH
  pm2 stop $APP_NAME
  cd app
  rm -rf ./*
  cd ../
  unzip -q build.zip -d app
  cd app
  mv build/* ./
  rm -rf build
  cp ../app_env ./.env
  pm2 start $APP_NAME
}

echo "deploying"
scp -r -P $SSH_PORT ./build.zip $SSH_USER@$SERVER_IP:$SERVER_APP_PATH
ssh -t -t $SSH_USER@$SERVER_IP -p $SSH_PORT "$(typeset -f); deploy"
