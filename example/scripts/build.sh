echo "Starting Ship Audit Android Build"
echo "=================================>"
echo "Choose Environment : (local, dev, test, prod)"
read ENVIRONMENT
echo $(pwd)

cd ../src/Config

sed -i "s/config.*/config.$ENVIRONMENT'/g" env.config.ts
echo "Updated $ENVIRONMENT config"
echo "Contents of env.config => "
cat env.config.ts

cd ../..

echo -e "\n==================================>"
echo -e "\nDo you want to update version: (Enter version number or n)"
read VERSION

if [ "$VERSION" != "n" ]; then
    sed -i "s/\"version\":.*/\"version\":\"$VERSION\",/" package.json
    echo "Updated version in package.json"
    cd ./android/app
    RAWCODE=$(cat build.gradle | grep -m 1 versionCode | awk '{print $2}')
    VERSIONCODE=$(($RAWCODE + 1))
    echo "new versionCode = $VERSIONCODE"
    sed -i "s/versionCode $RAWCODE.*/versionCode $VERSIONCODE/" build.gradle
    sed -i "s/versionName.*/versionName \"$VERSION\"/" build.gradle

    echo "Updated version and code in build.gradle"

    cd ../..

fi
cd ./scripts

echo -e "\nRunning script to copy icons and update name for Prod"
source copy-icon-name.sh $ENVIRONMENT

echo -e "\nRunning script to update bundle Id for Prod"
source update-bundle-id.sh $ENVIRONMENT
cd ../

echo -e "\n==================================>"
echo "Do you want to refresh node_modules:(y or n)"
read NPM

if [ "$NPM" == "y" ]; then
    echo "Installing node modules"
    rm -rf node_modules
    npm ci
fi

echo -e "\n==================================>"
echo "Initiating release build"
npm run build:android

echo "Restoring files to last git commit"

if ["$ENVIRONMENT" == 'prod']; then
    cd android/app/
    sed -i "s/applicationId 'com.rn.msal.example.*/applicationId 'com.rn.msal.example.dev'/" build.gradle

fi

echo -e "Finished build. Check android/app/build/outputs/apk/release for release apk.\n Press any key to exit!"
read INPUT
git restore src/Config/env.config.ts
#git restore android/app/src/main/res/values/strings.xml
git restore android/app/src/main/res/
exit
