#!/bin/bash

which brew
if [[ $? -ne 0 ]]; then
    curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh
fi

brew list | grep mongodb-community
if [[ $? -ne 0 ]]; then
    echo "mongodb is not installed"
    brew tap mongodb/brew
    brew install mongodb/brew/mongodb-community
fi

mongosh --version
if [[ $? -ne 0 ]]; then
    echo "mongo shell is not installed exiting"
    exit 1
fi

brew services start mongodb-community

#Node setup

node --version
if [[ $? -ne 0 ]]; then
    echo "node is not installed"
    brew install node
fi

npm install 

if [[ $SHELL == "/bin/zsh" ]]; then
    echo "alias startToDoApp='npm run dev && npm run startBackend'" >> ~/.zshrc
    source ~/.zshrc
elif [[ $SHELL == "/bin/bash" ]]; then
    echo "alias startToDoApp='npm run dev && npm run startBackend'" >> ~/.bashrc
    source ~/.bashrc
else
    echo "Unsupported shell"
    exit 1
fi

echo "Setup complete"
echo "You can now start the task app with 'startToDoApp'"
npm run dev & npm run startBackend

