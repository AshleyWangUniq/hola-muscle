import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface resetPasswords {
    oldPwd: string;
    newPwd: string;
    confirmPwd: string;
}

function Profile() {
    const {user, loading, deleteUser, resetPassword, updateInfo} = useUser();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [pwd, setPwd] = useState<string>("");
    const [editInfo, setEditInfo] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    
    const [pwds, setPwds] = useState<resetPasswords>({
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
    });

    async function deleteThis() {
        const res = await deleteUser(pwd);
        alert(res.message);
    }

    function startEditing() {
        setEditInfo(true);
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
        }
    }

    function resetChange() {
        setShowEdit(false);
        setPwds({
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
    });
    }

    function chancelEditInfo() {
        setFirstName("");
        setLastName("");
        setEmail("");
        setEditInfo(false);
    }

    async function changePwd(e : React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        if (pwds.oldPwd === "" || pwds.newPwd === "" || pwds.confirmPwd === "") {
            alert("All fields need to be filled");
        }

        else if (pwds.newPwd === pwds.oldPwd) {
            alert("passwords can't be the same");
        }

        else if (pwds.newPwd !== pwds.confirmPwd) {
            alert("Confirm password doesn't match");
        }
        resetPassword(pwds);
    }

    useEffect(()=>{
        if (loading) return;
        if (!user){
            console.log("no user");
            alert("no user");
            navigate("/");
        }
    },[user,loading]);

    async function saveInfo(e : React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!user) return;
        if (firstName === user.firstName && lastName === user.lastName && email === user.email) {
            alert("no change made");
            setEditInfo(false);
            return;
        }
        const res = await updateInfo({firstName, lastName, email});
        if (res.status === 200) {
            alert("updated");
            setEditInfo(false);
        } else {
            alert(res.message);
        }        
    }

    return <>
    <div className="container">
    <h1 className="text-pink">Hello, {user?.firstName}</h1>
    <hr className="hr"></hr>
    {editInfo && <button type="button" onClick={()=>chancelEditInfo()} className="btn float-end btn-pink btn-sm">Cancel</button>}
    {!editInfo && <button type="button" className="btn float-end" onClick={()=>startEditing()}><i className="bi bi-pencil-fill text-pink"></i></button>}
    <h5 className="text-pink">Personal Information</h5>
    <hr className="hr-light"></hr>
    {editInfo && 
    <div> 
        <form onSubmit={saveInfo}>
                    <div className="row">
            <div className="form-group col">
                <label htmlFor="firstName">First Name</label>
                <input className="form-control" type="text" value={firstName} onChange={(e)=> {
                    setFirstName(e.target.value)
                }}></input>
            </div>
            <div className="form-group col">
                <label htmlFor="lastName">Last Name</label>
                <input className="form-control" type="text" value={lastName} onChange={(e)=>
                    setLastName(e.target.value)
                }></input>
            </div>
        </div>
        <div className="form-group">
            <label htmlFor="email">Email</label>
            <input className="form-control" type="email" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
        </div>
        <button type="submit" className="btn btn-pink">Save</button>
        </form>
        </div>}
    {!editInfo && (<div>
    <p>{user?.firstName} {user?.lastName}</p>
    <p>{user?.email}</p></div>)}
    <hr className="hr-light"></hr>
    <div className="btn-group">
    <button type="button" className="btn btn-sm btn-pink me-1" onClick={()=>setShowModal(true)}>Delete User</button>
    <button type="button" className="btn btn-sm btn-pink" onClick={()=>setShowEdit(true)}>Reset Password</button>
    </div>
    </div>
    {showModal && 
        <div className="modal d-block" tabIndex={-1}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title text-pink">Delete User</h5>
                </div>
                <div className="modal-body">
                    <p>You are deleting your user, please enter your password to continue: </p>
                    <input className='form-control' type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)}></input>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-light me-1" onClick={()=>setShowModal(false)}>Cancel</button>
                    <button type="button" className="btn btn-pink" onClick={()=>deleteThis()}>Confirm</button>
                </div>
            </div>
        </div>
    </div> }
        {showEdit && 
        <div className="modal d-block" tabIndex={-1}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title text-pink">Edit Password</h5>
                </div>
                <form onSubmit={changePwd}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="text-pink">Old Password: </label>
                            <input className='form-control' type="password" value={pwds.oldPwd} onChange={(e)=>setPwds(prev => ({...prev, oldPwd: e.target.value}))}></input>
                        </div>
                        <div className="form-group">
                            <label className="text-pink">New Password: </label>
                            <input className='form-control' type="password" value={pwds.newPwd} onChange={(e)=>setPwds(prev => ({...prev, newPwd: e.target.value}))}></input>
                        </div>
                        <div className="form-group">
                            <label className="text-pink">Confirm Password: </label>
                            <input className='form-control' type="password" value={pwds.confirmPwd} onChange={(e)=>setPwds(prev => ({...prev, confirmPwd: e.target.value}))}></input>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light me-1" onClick={()=>resetChange()}>Cancel</button>
                        <button type="submit" className="btn btn-pink">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    </div> }
    </>
}

export default Profile;