import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMusic, 
  faMagnifyingGlass, 
  faPlus, 
  faDoorOpen, 
  faXmark, 
  faPowerOff,
  faGuitar,
  faCircleXmark 
} from "@fortawesome/free-solid-svg-icons";

export default function SearchBar({ search, setSearch, onCreate, onLogout }) {
  const [showModal, setShowModal] = useState(false);

  const handleConfirmLogout = () => {
    setShowModal(false);
    onLogout();
  };

  return (
    <>
      <nav className="navbar navbar-light fixed-top shadow-sm">
        <div className="container-fluid d-flex align-items-center" style={{ gap: "10px", flexWrap: "nowrap" }}>
          {/* Brand */}
          <a className="navbar-brand fw-bold" href="#" style={{ fontFamily: "'Bai Jamjuree', sans-serif", fontSize: "1.3rem" , color: "#333" }}>
            <FontAwesomeIcon icon={faGuitar} style={{marginRight: "5px"}}/> ChordBox
          </a>

          {/* Search Box */}
          <div className="input-group flex-grow-1">
            <input
              type="text"
              className="form-control"
              placeholder="ค้นหาเพลง..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearch("")}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>

          {/* Create Button */}
          <button className="btn btn-primary" onClick={onCreate}>
            <FontAwesomeIcon icon={faPlus} />
          </button>

          {/* Logout Button */}
          <button className="btn btn-danger" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        </div>
      </nav>

      {/* Modal Confirm Logout */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">ออกจากระบบ</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>คุณต้องการออกจากระบบหรือไม่?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  <FontAwesomeIcon icon={faXmark} /> ยกเลิก
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmLogout}>
                  <FontAwesomeIcon icon={faDoorOpen} /> ออกจากระบบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
