echo "Update Bundle Id"
echo "=================================>"
echo "Environment $1"

if [ "$1" == "prod" ]; then
    cd ../android/app/
    sed -i "s/applicationId 'com.rn.msal.example.*/applicationId 'com.rn.msal.example'/" build.gradle
    echo "Contents of build.gradle updated => "

    cd ../../scripts
    echo "current path"
    echo $(pwd)
fi

if [ "$1" == "test" ]; then
    cd ../android/app/
    sed -i "s/applicationId 'com.rn.msal.example.*/applicationId 'com.rn.msal.example.dev'/" build.gradle
    echo "Contents of build.gradle updated => "

    cd ../../scripts
    echo "current path"
    echo $(pwd)
fi

#echo -e "Finished copy.\n Press any key to exit!"
#read INPUT
#exit
