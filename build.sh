echo "building client"
npm run build --prefix ./client
rm -rf ./server/static
mkdir ./server/static

cp -R ./client/build ./server/static

echo "building server"
rm -rf ./build
cp -R ./server ./build
rm -rf build/.env

echo "zipping build"
zip -r ./build.zip ./build

echo "build finished"