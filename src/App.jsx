import './Table.css'
import  { useState, useEffect } from "react";
import './App.css'
const API_URL = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

const Table = () => {
  const [tableData, setTableData] = useState([]);//get data in table
  const [searchTerm, setSearchTerm] = useState("");//using search value for searching
  const [currentPage, setCurrentPage] = useState(1);//pagination: current page
  const [pageSize] = useState(10);//pagination: rows per page
  const [checkedItems, setCheckedItems] = useState({});//checked item for selection
  
  
  
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setTableData(data))//getting data from api
      .catch((error) => console.log(error));
  }, []);


  const deleteAll = () => {
    setTableData([])//delete all data
  }


  const handleCheck = (event) => {
    setCheckedItems({...checkedItems, [event.target.name]: event.target.checked });//update checked items
  }


  const handleDelete = () => {
    setTableData(tableData.filter((data) => !checkedItems[data.id]));//delete selected items
  }



  const handleSearch = (event) => {
    setSearchTerm(event.target.value);//getting data from user
    setCurrentPage(1);//reset current page to 1 when search term changes
  };



  const filteredData = tableData.filter((data) =>
    data.name.includes(searchTerm) || //search title using searchterm value
    data.id.toString().includes(searchTerm)|| //search id using searchterm value
    data.email.toString().includes(searchTerm)||//search email using searchterm value
    data.role.toString().includes(searchTerm)//search role using searchterm value
  );


  const pageCount = Math.ceil(filteredData.length / pageSize);//

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );//
  

  const Remove = (id) => {//delete button: remove item by non matching id with index logic
    const updatedListData = filteredData.filter((ele, index) => {
      return index !== id;
    });
    setTableData(updatedListData);
  };

  return (
    <div className='container'>
      <input type="text" placeholder="Search" onChange={handleSearch} />
      <table>
        <thead>
          <tr>
            <th>Checkbox</th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>
              <button style={{ backgroundColor: "red" }} onClick={deleteAll}>
                Delete All
              </button><button onClick={handleDelete}>Delete Selected</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((data, index) => (
            <tr key={data.id}>
              <td>
              <input
                  type="checkbox"
                  name={data.id}
                  checked={checkedItems[data.id]}
                  onChange={handleCheck}/>
              </td>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>{data.email}</td>
              <td>{data.role}</td>
              <td>
                <button onClick={() => Remove(index)}>Delete</button>
           
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="pagination">
        {Array.from({ length: pageCount }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Table;