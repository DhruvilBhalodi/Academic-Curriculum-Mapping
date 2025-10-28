import './App.css';
import Profile from './Profile';
import Home from './Home';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import React, { useState } from 'react';

function App() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const [user, setUser] = useState("");
  const [accessToken, setAccessToken] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState(false);
  
  const handleLogin = async (e) => {
    e.preventDefault(); // stop page reload
    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await response.json();
      const status = (data.status || "").trim().toLowerCase();
      console.log("Login response status:", status);
      if (data.status === "success") {
        setShow(false); // close popup
        setUser(data.user);
        setLoginStatus(true);
        setMessage(""); // clear any previous messages
        if (data.user_type === "faculty") {
          console.log("Faculty login successful");
          setAccessToken(true);
        } else {
          setAccessToken(false);
        }
      } else {
        console.log("Login faild:", data.message);
        setMessage("Login failed: " + data.message);
      }
    } 
    catch (error) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <>
      <div className="App">
        <div><BrowserRouter>
          <div style={{ backgroundImage: 'linear-gradient(to right, #8A78F5, #54C6FF)' }}>
            <br />
            <nav style={{ color: 'white', padding: '20px', fontSize: '25px' }}>
              <div align='left'>
                Academic Curriculum Mapping 
                <div style={{ float: 'right' , fontSize: '15px' }}>
                  {loginStatus ? (
                    <div className="profile-container">
                      <button className="profile-btn" onClick={() => setOpen(!open)}>
                        👤 {user} ▾
                      </button>
                    
                      <div className={`dropdown ${open ? "show" : ""}`} style={{zIndex:'100' , backgroundColor:'rgba(0,0,0,0.4)'}}>
                        {/* <Link to='/'><button className='button' onClick={()=>{setProfileData(!true);setOpen(!open);}} style={{width:'100%' , height: '100%'}}>Home</button></Link> */}
                        {/* <Link to='/Profile'><button className='button' onClick={()=>{setProfileData(true);setOpen(!open);}} style={{width:'100%' , height: '100%'}}>View Profile</button></Link> */}
                        <Link to='/'><button className='button' onClick={()=>{setLoginStatus(false);
                          setEmail("");
                          setPassword("");
                          setOpen(!open);
                          setProfileData(!true);}} style={{width:'100%' , height: '100%'}}>Logout</button></Link>
                      </div>
                    </div>
                  ) : (
                    <button
                      className='button2'
                      onClick={() => setShow(true)}
                    >
                      Login
                    </button>
                  )}
                </div>               
              </div>
            </nav>
            <br/>
          </div>

            <div style={{ backgroundColor: 'white' }}>
              {show ? (
                <div
                  align='center'
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <form
                    onSubmit={handleLogin}
                    style={{
                      backgroundColor: 'white',
                      border: 'grooved',
                      borderWidth: '3px',
                      padding: '10px',
                      borderRadius: '12px'
                    }}
                  >
                    <p align='right'>
                      Email:{" "}
                      <input
                        type='text'
                        placeholder='Email address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      /><br />
                      Password:{" "}
                      <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      /><br />
                    </p><p style={{color:'red' , fontSize:'14px'}}>{message}</p>
                    <button type='submit'>Submit</button>
                    <button
                      type='button'
                      style={{ marginLeft: '40px' }}
                      onClick={() => setShow(false)}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              ) : (
                <>{profileData  ? <><Routes>
                  <Route path='/Profile' element={<Profile/>} />
                </Routes></>:<><Routes>
                  <Route path='/' element={<Home accessToken={accessToken}  loginStatus={loginStatus}/>} />
                </Routes></>}
                </>
              )}
              
            </div>
          </BrowserRouter>
        </div>
      </div>
    </>
  );
}

export default App;