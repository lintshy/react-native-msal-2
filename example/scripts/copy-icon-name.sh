echo "Copy app icon"
echo "=================================>"
echo "Environment $1"
echo $(pwd)

rm -r ../android/app/src/main/res/mipmap-hdpi
rm -r ../android/app/src/main/res/mipmap-anydpi-v26
rm -r ../android/app/src/main/res/mipmap-xhdpi
rm -r ../android/app/src/main/res/mipmap-xxhdpi
rm -r ../android/app/src/main/res/mipmap-mdpi
rm -r ../android/app/src/main/res/mipmap-xxxhdpi
cp -r ../assets/app-icon-android-$1/res/mipmap* ../android/app/src/main/res

cd ../android/app/src/main/res/values

if [ "$1" == "test" ]; then
    sed -i "s/Quality Survey/Quality Survey Test/g" strings.xml
    echo "Updated app name"
    echo "Contents of strings.xml => "
    cat strings.xml
fi
if [ "$1" == "prod" ]; then
    sed -i "s/Quality Survey Test/Quality Survey/g" strings.xml
    echo "Updated app name"
    echo "Contents of strings.xml => "
    cat strings.xml
fi
cd ../../../../../../scripts

#echo -e "Finished copy.\n Press any key to exit!"
#read INPUT
#exit
