import { Fragment, useEffect, useState, React } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import Alert from 'react-bootstrap/Alert';


const Glossary = () => {

    const [show, setShow] = useState(false);
    const [createTerm, setCreate] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseTerm = () => setCreate(false)
    const handleShowTerm = () => setCreate(true);


    const [glossaryTerm, setTerm] = useState('')
    const [glossaryDefinition, setDefinition] = useState('')


    const [editTermId, setEditId] = useState('')
    const [editTerm, setEditTerm] = useState('')
    const [editdefinition, setEditDefinition] = useState('')

    const [data, setData] = useState([]);

    const [error, setError] = useState(false)
    const [lenerror, setLengthError] = useState(false)

    useEffect(() => {
        glossaryData();
    }, [])

    const glossaryData = () => {
        axios.get('/glossary/getGlossary')
            .then((result) => {
                setData(result.data);

            })
            .catch((error) => {
        
            })
    }
    const handleEdit = (termId) => {
        handleShow();
        axios.get(`/glossary/getGlossary/${termId}`)
            .then((result) => {
                setEditTerm(result.data.glossaryTerm);
                setEditDefinition(result.data.definition.glossaryDefinition);
                setEditId(termId);
            })
            .catch((error) => {

            })
        
    }
    const handleDelete = (termId) => {
        if (window.confirm("Are you sure to delete this Term?") == true) {
            axios.delete(`/glossary/deleteGlossary/${termId}`)
                .then((result) => {
                    if (result.status === 200) {
                        glossaryData();
                    }
                })

        }
    }
    const handleUpdate = () => {
        if(editTerm.length == 0 || editdefinition.length == 0){
            setError(true)
        }
        if(editdefinition.length > 150 || editTerm.length > 50){
            setLengthError(true)
        }
        else{
        const url = `/glossary/updateGlossary/${editTermId}`;
        const data = {
            "glossaryTerm": editTerm,
            "glossaryDefinition": editdefinition
        }
        axios.put(url, data)
            .then((result) => {
                glossaryData();
                clear();
                handleClose();
            }).catch((error) => {
                alert(error);
            })
        }

    }
    const handleSave = () => {   
      
        if(glossaryTerm.length == 0 || glossaryDefinition.length == 0){
            setError(true)
        } 
        if(glossaryDefinition.length > 150 || glossaryDefinition.length > 50){
            setLengthError(true)
        }
        else {
            const url = '/glossary';
            const data = {
                "glossaryTerm": glossaryTerm,
                "glossaryDefinition": glossaryDefinition
            }

            axios.post(url, data)
                .then((result) => {
                    glossaryData();
                    clear();
                    handleCloseTerm();
                }).catch((error) => {
                    alert(error);
                })
        }
    
    }

    const clear = () => {
        setTerm('');
        setDefinition('');
        setEditTerm('');
        setEditDefinition('');
        setEditId();
    }


    return (
        <Fragment >
            <div className="container" style={{ "textAlign": "left" }}>
                <div className="card">
                    <div className="card-title">
                        <h3>Glossary App</h3>
                    </div>
                    <div className="card-body">
                        <Button variant="primary"  onClick={handleShowTerm} className="mt-4">
                            Add Term
                        </Button>

                        <Modal show={createTerm} onHide={handleClose}>
                            <Modal.Header>
                                <Modal.Title>Add Term</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <form className="needs-validation">
                                    <div class="form-group">
                                        <label>Term:</label>
                                        <input type="text" class="form-control" required placeholder="Enter Term" value={glossaryTerm} onChange={(e) => setTerm(e.target.value)}></input>
                                        {error && glossaryTerm.length <= 0 ?
                                        <small class="text-danger">Term can't be Empty</small>:""
                                        }
                                         {lenerror && glossaryTerm.length > 50 ?
                                        <small class="text-danger">Term can't be greater than 50 characters</small>:""
                                        }
                                    </div>
                                    <div class="form-group">
                                        <label>Definition:</label>
                                        <textarea class="form-control" required placeholder="Enter Definition" rows="3" value={glossaryDefinition} onChange={(e) => setDefinition(e.target.value)}></textarea>
                                        {error && glossaryDefinition.length <= 0 ?
                                        <small class="text-danger">Definition can't be Empty</small>:""
                                        }
                                        {lenerror && glossaryDefinition.length > 150 ?
                                        <small class="text-danger">Definition can't be greater than 150 characters</small>:""
                                        }
                                    </div>
                            </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseTerm}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleSave}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <Table striped border hover>
                            <thead className="bg-dark text-white mt-6" >
                                <tr>
                                    <td style={{width: '20%'}}>Term</td>
                                    <td style={{width: '45%'}}>Definition</td>
                                    <td style={{width: '10%'}}>Created Date</td>
                                    <td style={{width: '10%'}}>Modified Date</td>
                                    <td style={{width: '15%'}}>Actions</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data && data.length > 0 ?
                                        data.map((item, index) => {
                                            return (
                                                <tr>
                                                    <td>{item.glossaryTerm}</td>
                                                    <td>{item.definition.glossaryDefinition}</td>
                                                    <td>{item.createdDate}</td>
                                                    <td>{item.modifiedDate}</td>
                                                    <td colspan={2}>
                                                        <button className="btn btn-primary" onClick={() => handleEdit(item.termId)}>Edit</button> &nbsp;
                                                        <button className="btn btn-danger" onClick={() => handleDelete(item.termId)}>Delete</button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                      
                                    <Alert variant= "info" style={{height : '100%'}}>No Terms Added</Alert>      
                                       
                                }
                            </tbody>

                        </Table>
                        <Modal show={show}>
                            <Modal.Header>
                                <Modal.Title>Modify Term</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <div class="form-group">
                                        <label>Term</label>
                                        <input type="text" class="form-control" placeholder="Enter Term" value={editTerm} onChange={(e) => setEditTerm(e.target.value)}></input>
                                        {error && editTerm.length <= 0 ?
                                        <small class="text-danger">Term can't be Empty</small>:""
                                        }
                                          {lenerror && editTerm.length > 50 ?
                                        <small class="text-danger">Term can't be greater than 50 characters</small>:""
                                        }
                                    </div>
                                    <div class="form-group">
                                        <label>Definition</label>
                                        <textarea class="form-control" placeholder="Enter Definition" rows="3" value={editdefinition} onChange={(e) => setEditDefinition(e.target.value)}></textarea>
                                        {error && editdefinition.length <= 0 ?
                                        <small class="text-danger">Definition can't be Empty</small>:""
                                        }
                                        {lenerror && editdefinition.length > 150 ?
                                        <small class="text-danger">Definition can't be greater than 150 characters</small>:""
                                        }
                                    </div>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleUpdate}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        </Fragment>




    );

}

export default Glossary

