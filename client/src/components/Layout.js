import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import ToolBar from "./ToolBar";


const Layout = () => {

    const [folder, setFolder] = useState(null);
    const history = useHistory();
    var path = history.location.pathname;
    var curr_dir = path.split("/")[-1];
    /*if (path !== '/') {
        path = path + "/";
    }*/

    useEffect(() => {
        var dropDowns = document.querySelectorAll('.dropdown-trigger');
        var instances = M.Dropdown.init(dropDowns, {});
    }, [folder]);

    useEffect(() => {
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
            setFolder(folder);
            console.log(folder);
        }).catch((err) => console.log(err))
    }, [path]);

    return (
        <> {
            
            !folder ? <h3 className="myfont"> Loading... </h3> :
                <div className="container">
                    <ToolBar />
                    <hr />
                    <div className="flexContainer">
                        {folder.folders.length == 0 && folder.files.length == 0 ?
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
                                    <i style={{ color: "#d53939" }} className="large material-icons">{item.fileType === 'pdf' ? 'picture_as_pdf': "image"}</i>
                                </a>
                                <div style={{ margin: "0px" }}>{item.name}
                                <a class='dropdown-trigger' href='#' data-target={item._id}>
                                    <i style = {{paddingLeft: "5px"}} className="tiny material-icons">more_vert</i>
                                </a></div>

                                <ul id={item._id} class='dropdown-content'>
                                    <li><a href = {item.url.substring(0, 46) + "/fl_attachment" + item.url.substring(46)} target = "blank">Download</a></li>
                                    <li><a href="#!">Share</a></li>
                                    <li><a href="#">Delete</a></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
        }
        </>
    );
}

export default Layout;