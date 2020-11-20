import React, { useEffect, useState } from 'react';
import { Link , useHistory } from 'react-router-dom';
import M from 'materialize-css';


const Layout = () => {

    const [folder, setFolder] = useState(null);
    const history = useHistory();
    var path = history.location.pathname;
    var curr_dir = path.split("/")[-1];
    /*if (path !== '/') {
        path = path + "/";
    }*/

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
            !folder ? <h3> Working... </h3> : 
            <div className = "container">
                <div className="flexContainer">
                    
                        {folder.folders.map((item, index) =>
                            <div key={index} className = "flexItem">
                                <Link to = {item.path}><i style = {{color: "#4267b2"}} className ="large material-icons">folder</i></Link>
                                <p style={{margin: "0px"}}>{item._id}</p>
                                <p style={{margin: "0px"}}>{curr_dir}</p>
                            </div>
                        )}
                   
                </div>
            </div>
        }
        </>
    );
}

export default Layout;