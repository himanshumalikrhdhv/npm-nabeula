
import './App.css';
import FolderListKS from './components/FolderListKS';
function App() {
 const baseUrl = "https://nebuladocumentshimanshu.blob.core.windows.net/";
 const  sasString = "?sv=2020-08-04&ss=b&srt=sco&sp=rwdlacitfx&se=2023-03-28T16:55:07Z&st=2022-03-28T08:55:07Z&spr=https&sig=TqRn0s9Eq2%2BMTip0UBdVArrRKJTsWBr3jnyYclyHhpo%3D";
 const containerName = "malik";
 const toolBar = true;
 const fileInfo= false;
 return (
    <div className="App">
      <FolderListKS baseUrl={baseUrl} sasString={sasString} containerName={containerName} fileInfo={fileInfo} toolBar={toolBar}/>
    </div>
  );
}
export default App;
