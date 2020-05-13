
HOST="preview.joergviola.de"
USER="joerg"

INSTALL="/var/www/gluon"

REPO=""

SSH="ssh -tq $USER@$HOST"
SCP="scp"

echo "Updating backend..."
$SSH "cd $INSTALL && git pull && cd backend && composer install && php artisan migrate"

echo "Deploying frontend..."
$SSH "cd $INSTALL/backend/public/app && rm -rf *"
$SCP -r ../backend/public/app/* "$USER@$HOST:$INSTALL/backend/public/app"
