call activate.bat 
pushd src
start uvicorn api:app --reload
popd