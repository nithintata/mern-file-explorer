import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import ToolBar from "./ToolBar";

const Layout = () => {

    const innerModel = useRef(null);
    const textAreaRef = useRef(null);
    const [copySuccess, setCopySuccess] = useState('');
    const [folder, setFolder] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    var path = history.location.pathname;

    useEffect(() => {
        var dropDowns = document.querySelectorAll('.dropdown-trigger');
        var instances = M.Dropdown.init(dropDowns, {});
        M.Modal.init(innerModel.current, { onCloseStart: () => setCopySuccess('') });
    }, [folder]);

    useEffect(() => {
        if (!localStorage.getItem('jwt')) {
            history.push('/signIn');
            return;
        }
        setIsLoading(true);
        fetch('/getFiles', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                path
            })
        }).then(res => res.json()).then((data) => {
            const { err, folder } = data;
            setIsLoading(false);
            if (err) {
                M.toast({ html: err });
                history.push('/');
            }
            else {
                setFolder(folder);
                console.log(folder);
            }
        }).catch((err) => console.log(err))
    }, [path]);

    const getShortenedLink = (url) => {
        M.toast({ html: "Creating tiny URL!" });
        fetch('https://api-ssl.bitly.com/v4/shorten', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.REACT_APP_BIT_LY_KEY
            },
            body: JSON.stringify({
                long_url: url
            })
        }).then(res => res.json()).then((data) => {
            console.log(data);
            textAreaRef.current.value = data.link;
            M.Modal.getInstance(innerModel.current).open();
        })
    }

    const copyContent = (e) => {
        textAreaRef.current.select();
        document.execCommand('copy');
        e.target.focus();
        setCopySuccess("Link Copied!");
    }

    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    const deleteFile = (file) => {
        M.toast({ html: "Deleting the file" });
        fetch('/deleteFile', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                id: file._id,
                path: file.path
            })
        }).then((res) => res.json()).then((data) => {
            M.toast({ html: "Cloudinary: " + data.result });
            M.toast({ html: "File Deleted Successfully.." });
            window.location.reload(false);
        })
    }


    return (
        <> {
            !folder ? <h3 className="myfont"> Loading... </h3> :
                <div className="container">
                    <ToolBar />
                    <hr />
                    {
                        isLoading ?
                            <div style={{ backgroundColor: "#2e3a48", marginBottom: "0px" }} className="progress">
                                <div className="indeterminate"></div>
                            </div> : null
                    }

                    <div style={{ backgroundColor: "#2e3a48", padding: "5px" }}>
                        {path.split("/").join(" / ")}
                        <i style={{ paddingLeft: "5px" }} className="tiny material-icons" onClick={() => copyToClipboard(path)}>content_copy</i>
                    </div>

                    <div className="flexContainer">
                        {
                            !isLoading ?
                                <>
                                    {folder.folders.length === 0 && folder.files.length === 0 ?
                                        <h4 className="myfont" style={{ backgroundColor: "#2e3a48" }}>This Folder is Empty...</h4> : null}

                                    {folder.folders.map((item, index) =>
                                        <div key={index} className="flexItem innerItems">
                                            <Link to={item.path}><i style={{ color: "#4267b2" }} className="large material-icons">folder</i></Link>
                                            <p style={{ margin: "0px" }}>{item.name}</p>
                                        </div>
                                    )}

                                    {folder.files.map((item, index) =>
                                        <div key={index} className="flexItem innerItems">
                                            <a href={item.url} target="blank">
                                                <i style={{ color: "#d53939" }} className="large material-icons">{item.fileType === 'pdf' ? 'picture_as_pdf' : "image"}</i>
                                            </a>
                                            <div style={{ margin: "0px" }}>{item.name}
                                                <a className='dropdown-trigger' href='#' data-target={item._id}>
                                                    <i style={{ paddingLeft: "5px" }} className="tiny material-icons">more_vert</i>
                                                </a></div>

                                            <ul id={item._id} className='dropdown-content'>
                                                <li><a href={item.url.substring(0, 46) + "/fl_attachment" + item.url.substring(46)} target="blank">Download</a></li>
                                                <li><a href="#" onClick={() => getShortenedLink(item.url)}>Share</a></li>
                                                <li><a href="#" onClick={() => deleteFile(item)}>Delete</a></li>
                                                <li><a href="#">Move</a></li>
                                            </ul>
                                        </div>
                                    )}

                                </> : null
                        }
                    </div>

                    <div id="modal1" className="modal" ref={innerModel}>
                        <div className="modal-content">
                            <p style={{ color: "black" }}>Anyone can view this document through this link</p>
                            <textarea className="materialize-textarea" style={{ width: "auto" }} ref={textAreaRef} readOnly></textarea>
                            <i style={{ color: "black", padding: "5px" }} onClick={(e) => copyContent(e)} className="small material-icons">content_copy</i>
                            <p style={{ color: "green" }}><b>{copySuccess}</b></p>
                        </div>
                        <div className="modal-footer">
                            <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
                        </div>
                    </div>
                </div>
        }
        </>
    );
}

export default Layout;