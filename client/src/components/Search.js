import React, { useEffect, useState } from 'react';
import M from 'materialize-css';

const Search = () => {
    const [fileType, setFileType] = useState('file');
    useEffect(() => {
        M.AutoInit();
    }, []);

    useEffect(() => {
        console.log("Type-" + fileType);
    }, [fileType]);

    return (
        <div className="container">
            <h4 className="myfont" style={{ textAlign: 'center' }}>Online File Explorer</h4>
            <div>
                <h6>Search For: </h6>
                <label style={{ margin: "5px" }}>
                    <input onChange={(e) => setFileType(e.target.value)} name="fileType" value="file" type="radio" />
                    <span> File </span>
                </label>
                <label style={{ margin: "5px" }}>
                    <input onChange={(e) => setFileType(e.target.value)} name="fileType" value="folder" type="radio" />
                    <span> Folder </span>
                </label>
            </div>

            <div>
                <h6>Additional Filters: </h6>
                <div className="selectInputContainer">
                <span>File Type</span>
                    <select>
                        <option value="" >All</option>
                        <option value="pdf">PDF</option>
                        <option value="jpg">JPG</option>
                        <option value="png">PNG</option>
                    </select>
                </div>
                <div className="selectInputContainer">
                <span>Sort By</span>
                    <select>
                        <option value="updatedAt">Date Modified</option>
                        <option value="createdAt">Date Created</option>
                 </select>                   
                </div>
                <div className="selectInputContainer">
                <span>Order</span>
                    <select>
                        <option value="1">Ascending</option>
                        <option value="-1">Descending</option>
                 </select>                   
                </div>
            </div>
            <hr />


        </div>
    )
}

export default Search;