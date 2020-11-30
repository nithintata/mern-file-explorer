import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

const ToolBar = () => {

    const history = useHistory();
    var path = history.location.pathname;
    var parent_path = "/" + path.split('/').slice(1, -2).join('/') + "/";
    if (parent_path === "//") {
        parent_path = "/";
    }
    const [folderName, setFolderName] = useState('');
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (file) {
            const data = new FormData();
            const fileName = file.name.split(".")[0];
            const fileType = file.name.split(".")[1];
            data.append("file", file);
            data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
            data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
            data.append('public_id', path.substring(1) + fileName);
            fetch('https://api.cloudinary.com/v1_1/nithin/auto/upload', {
                method: 'post',
                body: data
            }).then(res => res.json()).then((data) => {
                console.log(data);
                fetch('/create/newFile', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                    },
                    body: JSON.stringify({
                        path: path,
                        file: {
                            name: fileName,
                            fileType,
                            path: path + fileName,
                            url: data.secure_url
                        }
                    })
                }).then(res => res.json()).then((data) => {
                    const { err, file } = data;
                    setIsUploading(false);
                    setFile('');
                    console.log(file);
                    if (err) {
                        M.toast({ html: err });
                    }
                    else {
                        M.toast({ html: "File created Successfully" })
                        window.location.reload(false);
                    }
                })
            })
        }
    }, [file]);

    const uploadFile = (file) => {
        setIsUploading(true);
        setFile(file);
    }

    const toggleInput = () => {
        var ele = document.getElementById('folder-name-input');
        if (ele.style.display == 'none') {
            ele.style.display = 'block';
        }
        else {
            ele.style.display = 'none';
        }
    }

    const createFolder = () => {
        var new_folder_path = path + folderName + "/";

        fetch('/create/newFolder', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                name: folderName,
                path: new_folder_path
            })
        }).then(res => res.json()).then((data) => {
            const { err, folder } = data;
            if (err) {
                M.toast({ html: err });
            }
            else {
                M.toast({ html: "Folder created Successfully" });
                console.log(folder);
                history.push(new_folder_path);
                setFolderName('');
                toggleInput();
            }
        })
    }

    const pushToHome = () => {
        history.push('/');
    }

    const downloadFolder = () => {
        M.toast({html: "Creating Zip file!"});
        fetch('/downloadFolder', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                path: path
            })
        }).then(res => res.json()).then((data) => {
            const { err, url} = data;
            if (err) {
                M.toast({html: err});
            }
            else {
                window.open(url);
                M.toast({html: "Starting Download.."});
            }
        })
    }

    const deleteFolder = () => {
        M.toast({html: "Deleting Folder..This may take a while"});
        fetch('/deleteFolder', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                path: path
            })
        }).then(res => res.json()).then((data) => {
            const { err, msg } = data;
            if (err) {
                M.toast({html: err});
            }
            else {
                M.toast({html: msg});
                history.push(parent_path);
            }
        })
    }

    return (
        <>
        <h4 className = "myfont" style={{textAlign: 'center'}}>Online File Explorer</h4>
            {isUploading ?
                <h4 className="myfont" style={{ textAlign: "center" }}>Uploading Please don't navigate away</h4> :

                <div className="flexContainer" style={{ minHeight: "0px", padding: "10px 20px", justifyContent: "flex-start" }}>

                    <div className="flexItem" style={{ margin: "10px" }}>
                        <Link to={parent_path}><i className="small material-icons">arrow_back</i></Link>
                    </div>

                    <div className="flexItem" style={{ margin: "10px" }}>
                        <i className="small material-icons" onClick={pushToHome}>home</i>
                    </div>

                    <div className="flexItem" style={{ margin: "10px" }}>
                        <i className="small material-icons" onClick={toggleInput}>create_new_folder</i>
                    </div>

                    <div className="flexItem">
                        <input style={{ display: "none" }} type="text" value={folderName} placeholder="Folder name.." id="folder-name-input"
                            onChange={(e) => setFolderName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' ? createFolder() : null} />
                    </div>

                    <div className="flexItem" style={{ margin: "10px" }}>
                        <label for="file-input">
                            <i className="small material-icons">cloud_upload</i>
                        </label>
                        <input id="file-input" type="file" onChange={(e) => uploadFile(e.target.files[0])} style={{ display: "none" }} />
                    </div>

                    <div className="flexItem" style={{ margin: "10px" }}>
                        <i className="small material-icons" onClick={(e) => downloadFolder()}>cloud_download</i>
                    </div>

                    <div className="flexItem" style={{ margin: "10px" }}>
                        <i className="small material-icons" onClick={(e) => deleteFolder()}>delete</i>
                    </div>

                    <div className="flexItem" style={{ margin: "10px" }}>
                        <Link to={"/search"}><i className="small material-icons">search</i></Link>
                    </div>


                </div>
            }
        </>
    )
}

export default ToolBar;