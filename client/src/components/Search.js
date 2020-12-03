import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import M from 'materialize-css';
import moment from 'moment';

const Search = () => {
    const [searchFor, setSearchFor] = useState('file');
    const [fileType, setFileType] = useState('all');
    const [sortBy, setSortBy] = useState('updatedAt');
    const [order, setOrder] = useState('');
    const [name, setName] = useState('');
    const [searchData, setSearchData] = useState([]);

    useEffect(() => {
        M.AutoInit();
    }, []);

    useEffect(() => {
        fetch('/filterSearch', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                name,
                searchFor,
                fileType,
                sortBy,
                order
            })
        }).then(res => res.json()).then((data) => {
            console.log(data);
            setSearchData(data);
        })
    }, [searchFor, fileType, sortBy, order, name]);

    const downloadFolder = (path) => {
        M.toast({ html: "Creating Zip file!" });
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
            const { err, url } = data;
            if (err) {
                M.toast({ html: err });
            }
            else {
                window.open(url);
                M.toast({ html: "Starting Download.." });
            }
        })
    }

    return (
        <div className="container">
            <Link to={"/"}><h4 className="myfont" style={{ textAlign: 'center' }}>Online File Explorer</h4></Link>
            <ul className="collapsible">
                <li className="active">
                    <div className="collapsible-header"><i className="material-icons">find_in_page</i>Search For: </div>
                    <div className="collapsible-body">
                        <label style={{ margin: "5px" }}>
                            <input onChange={(e) => setSearchFor(e.target.value)} name="searchFor" value="file" type="radio" />
                            <span> File </span>
                        </label>
                        <label style={{ margin: "5px" }}>
                            <input onChange={(e) => setSearchFor(e.target.value)} name="searchFor" value="folder" type="radio" />
                            <span> Folder </span>
                        </label>
                    </div>
                </li>
                <li>
                    <div className="collapsible-header"><i className="material-icons">filter_list</i>Additional Filters: </div>
                    <div className="collapsible-body clearfix">
                        <div className="selectInputContainer">
                            <span>File Type</span>
                            <select onChange={(e) => setFileType(e.target.value)}>
                                <option value="all" >All</option>
                                <option value="pdf">PDF</option>
                                <option value="jpg">JPG</option>
                                <option value="png">PNG</option>
                            </select>
                        </div>
                        <div className="selectInputContainer">
                            <span>Sort By</span>
                            <select onChange={(e) => setSortBy(e.target.value)}>
                                <option value="updatedAt">Date Modified</option>
                                <option value="createdAt">Date Created</option>
                            </select>
                        </div>
                        <div className="selectInputContainer">
                            <span>Order</span>
                            <select onChange={(e) => setOrder(e.target.value)}>
                                <option value="">Ascending</option>
                                <option value="-">Descending</option>
                            </select>
                        </div>
                    </div>
                </li>
            </ul>

            {/*Displaying Fetched data */}

            <input id="last_name" value={name} onChange={(e) => setName(e.target.value)}
                type="text" placeholder="Start Typing..."
                style={{ border: "1px solid white", width: "auto", borderRadius: "10px", padding: "5px" }}
            />
            {searchData.length == 0 ?
                <h4 style={{ textAlign: "center" }} className="myfont"> No Items to Display...</h4> : null}


            {searchFor === 'file' ?
                <table className="highlight">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Size</th>
                            <th>Last Modified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {searchData.map((file) => {
                            return (
                                <tr>
                                    <td>{file.name}</td>
                                    <td>{file.fileType}</td>
                                    <td>{file.size}</td>
                                    <td>{moment(file.updatedAt).format("lll")}</td>
                                    <td>
                                        <a title="view" href={file.url} target="blank"><i className="small material-icons">visibility</i></a>
                                        <a title="download" href={file.url.substring(0, 46) + "/fl_attachment" + file.url.substring(46)} target="blank">
                                            <i className="small material-icons">file_download</i>
                                        </a>
                                        <Link title="Open file location" to={file.path.split('/').slice(0, -1).join('/') + '/'}><i className="small material-icons">folder</i></Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                :

                <table className="highlight">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Last Modified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {searchData.map((folder) => {
                            return (
                                <tr>
                                    <td>{folder.name}</td>
                                    <td>{moment(folder.updatedAt).format("lll")}</td>
                                    <td>
                                        <Link title="Open folder location" to={folder.path}><i className="small material-icons">visibility</i></Link>
                                        <i title="Download" className="small material-icons" onClick={(e) => downloadFolder(folder.path)}>file_download</i>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            }



        </div>
    )
}

export default Search;