import {
  Link,  useLocation 
} from "react-router-dom";
import React, {useState, useEffect, useContext} from "react";
import ReactQuill, {Quill} from 'react-quill';
import '../../quill.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPencilAlt} from '@fortawesome/free-solid-svg-icons'
import ReactHtmlParser from 'react-html-parser'; 
import QuillToolbar from "../QuillToolbar.jsx";

import {WebContext} from "../../App"

// Modules object for setting up the Quill editor
export const modules = {
  toolbar: {
    container: "#toolbar",
    // handlers: {
    //   // save: ()=>{alert("he")},
    // }
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true
  }
};


let Block = Quill.import('blots/block');
  // class BoldBlot extends Inline { }
  // BoldBlot.blotName = 'bold';
  // BoldBlot.tagName = 'strong';
  // Quill.register('formats/bold', BoldBlot);

// const formats = ["bold"] // add custom format name + any built-in formats you need


class HeaderBlot extends Block {
  // constructor(domNode) {
  //   super(domNode);

  //   // Bind our click handler to the class.
  //   domNode.setAttribute('id', "hello");
  // }
  // static formats(node) {
  //   // node.in
  //   let value = node.tagName[1]-1;
  //   return parseInt(value)
  // }
}
HeaderBlot.blotName = 'header';
// Medium only supports two header sizes, so we will only demonstrate two,
// but we could easily just add more tags into this array
HeaderBlot.tagName = ['H1','H1','H2', 'H3','H4',"H5"];
Quill.register('formats/header', HeaderBlot);

// Formats objects for setting up the Quill editor
export const formats = [
  "header",
  "font",
  // "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "code-block"
];

const linkStyles = {
  "h1":{},
  "h2":{marginLeft: "1em"},
  "h3":{marginLeft: "2em"}

}

export default function WalkThrough(props) {
  const [sectionLinks, setSectionLinks] = useState([
    { text: "Header", linkToID: "Header-H1", type: "h1" },
    { text: "A Smaller Header", linkToID: "ASmallerHeader-H2", type: "h2" }
    
  ]);
  const [pagePath,setPagePath] = useState("")
  const [html, setHtml] = useState("Test");
  const [edit, setEdit] = useState(false);
  const [isShowButtons, showButtons] = useState(false)

    const { webStyle } = useContext(WebContext);


  useEffect(() => {
    
    // alert(storedState)
    if (Object.keys(props.content).length > 0){
      // alert(JSON.stringify(props.content.html))
      // setHtml(props.content.html, ()=>{
        setContent(props.content)
      // })
      
    }
    
   

  }, []);

  const setContent =  (content) =>{
    var el = document.createElement( 'html' );
    


    if (!content){
      el.innerHTML = html;
      
    }
    else{
      el.innerHTML = content.html;
      setPagePath(content.pagePath);
    }
    var headers = Array.from(el.querySelectorAll('h1,h2,h3,h4,h5,h6'))

    let newSectionLinks = []

    headers.forEach(header=>{

      let id = header.innerHTML
      id = id.replaceAll(" ","_")
      id +="-"+header.tagName.toLowerCase()

      header.id = id
      // alert(JSON.stringify({ text: header.innerHTML, linkToID: header.innerHTML.replace(" ","-")+"-"+header.tagName.toLowerCase(), type: header.tagName.toLowerCase() }))
      newSectionLinks.push({ text: header.innerHTML, linkToID: id, type: header.tagName.toLowerCase() })
    })

    setSectionLinks(newSectionLinks)
    setHtml(el.children[1].innerHTML)
  }

  const saveEdits = () =>{
    setEdit(false)

    // alert("Parse headers")
    setContent()
    

  }

  const handleChange = (html, delta, source, editor) => {
    setHtml( html );
    // localStorage.setItem(props.id+"-quill",JSON.stringify(html));

  };

  const copyToClipboard =() =>{
    let htmlString = html.replace(/></g,`>\n<`)
    navigator.clipboard.writeText(htmlString)
    alert("Copied contents to clipboard")
  }

  

  const links = sectionLinks.map((sectionLink) => {
    // Make these editable?
    let linkStyle = linkStyles[sectionLink.type]

    let path = "/"+pagePath

    return (
      <div className="row" key = {props.id+"linkDiv-row"+sectionLink.linkToID}>
        {/* <Link className = {"link-dark text-decoration-none h5"} style={{...linkStyle}} to={"/getting-started#"+sectionLink.linkToID}  key={"link2" + sectionLink.text}>{sectionLink.text}</Link> */}

        <Link
        className="link-dark text-decoration-none h5"
        style={{...linkStyle, color:webStyle.darkShade}}
        to={{
          pathname:path,
          hash:"#"+sectionLink.linkToID
        }}
        key={"a2" + sectionLink.id}
        >
        {sectionLink.text}
      </Link>
      </div>
      
    );
  });

  return (
    <div className={(webStyle.isMobile?"px-3":"px-5")} data-no-dnd="true">
      <div className="row boxShadow g-0" style={{backgroundColor:webStyle.lightShade}}>
      
      <div className={webStyle.isMobile?"col-12":"col-8"}>
        {edit && webStyle.isAdmin && webStyle.isEditMode?
          <div>
            <div className={"sticky-top "}>
              <QuillToolbar update  checkCallback = {saveEdits} clipboardCallback = {() => {copyToClipboard()}}/>
            </div>
            <ReactQuill
              className={"py-5 px-5"}
              theme="snow"
              value={html}
              onChange={handleChange}
              placeholder={"Write something awesome..."}
              modules={modules}
              scrollingContainer={'body'}
              formats={formats}
            />
          </div>:
          <div className="relative-div" onMouseEnter={() => {showButtons(true)}} onMouseLeave={() => {showButtons(false)}}>
            
            <div style={{height:"1.5rem"}} className="sticky-top" >
              {isShowButtons && webStyle.isAdmin && webStyle.isEditMode &&
              <div className="relative-r pe-2 pt-3">
                <FontAwesomeIcon icon = {faPencilAlt} onClick={()=>{setEdit(true)}}/>
              </div>}
            </div>

            <div className="py-4 px-5 " style ={{color:webStyle.darkShade}}>{ ReactHtmlParser (html) } </div>
            
          </div>
          }   
        </div>
        {!webStyle.isMobile&&<div className="col-4 align-items-stretch">
          <div className="px-5 h-100 " style ={{borderColor:webStyle.darkAccent, borderLeft:"1px solid"}}>
            <div className={"sticky-top "+(webStyle.isShowEditor?"py-7":"py-5")} >
              {links}

            </div>
          </div>
          
        </div>}
      </div>
    </div>
  );
}

