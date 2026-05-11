import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Manager = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");

  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Random Avatar
  const avatar =
    currentUser?.gender?.toLowerCase() === "female"
      ? "https://randomuser.me/api/portraits/women/44.jpg"
      : "https://randomuser.me/api/portraits/men/32.jpg";

  // Fetch Data
  useEffect(() => {
    fetchData();
    fetchManagerAttendance();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await axios.get("http://localhost:3000/employe");
      const leaveRes = await axios.get("http://localhost:3000/leaves");
      const attRes = await axios.get("http://localhost:3000/attendance");

      setUsers(userRes.data || []);
      setLeaves(leaveRes.data || []);
      setAttendance(attRes.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // Today's Attendance
  const fetchManagerAttendance = async () => {
    if (!currentUser) return;

    const today = new Date().toLocaleDateString();

    try {
      const res = await axios.get("http://localhost:3000/attendance");

      const todayData = res.data.find(
        (a) => a.userId === currentUser.id && a.date === today
      );

      if (todayData) {
        setCheckInTime(todayData.checkIn || "");
        setCheckOutTime(todayData.checkOut || "");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Check In
  const handleCheckIn = async () => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const today = new Date().toLocaleDateString();

    try {
      const res = await axios.get("http://localhost:3000/attendance");

      const already = res.data.find(
        (a) => a.userId === currentUser.id && a.date === today
      );

      if (already) {
        alert("Already checked in!");
        return;
      }

      await axios.post("http://localhost:3000/attendance", {
        userId: currentUser.id,
        name: currentUser.firstName,
        department: currentUser.department,
        contact: currentUser.contact,
        salary: currentUser.salary,
        date: today,
        checkIn: time,
        checkOut: "",
      });

      setCheckInTime(time);

      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  // Check Out
  const handleCheckOut = async () => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const today = new Date().toLocaleDateString();

    try {
      const res = await axios.get("http://localhost:3000/attendance");

      const record = res.data.find(
        (a) => a.userId === currentUser.id && a.date === today
      );

      if (!record) {
        alert("Please check in first!");
        return;
      }

      if (record.checkOut) {
        alert("Already checked out!");
        return;
      }

      await axios.patch(
        `http://localhost:3000/attendance/${record.id}`,
        {
          checkOut: time,
        }
      );

      setCheckOutTime(time);

      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  // Stats
  const totalEmployees = users.filter(
    (u) => u.role === "employee"
  ).length;

  const pendingLeaves = leaves.filter(
    (l) => l.status === "pending"
  ).length;

  const approvedLeaves = leaves.filter(
    (l) => l.status === "approved"
  ).length;

  // Today's Attendance
  const today = new Date().toLocaleDateString();

  const todayAttendance = attendance.filter(
    (a) => a.date === today
  );

  const presentToday = todayAttendance.filter(
    (a) => a.checkIn && a.checkIn !== ""
  ).length;

  // Employee Filter
  const filteredEmployees = users.filter((u) => {
    const matchRole = u.role === "employee";

    const matchSearch = `${u.firstName} ${u.lastName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchDept =
      departmentFilter === "all" ||
      u.department === departmentFilter;

    return matchRole && matchSearch && matchDept;
  });

  // Departments
  const departments = [
    ...new Set(users.map((u) => u.department).filter(Boolean)),
  ];

  return (
    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        fontFamily: "sans-serif",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: "280px",
          background: "#111827",
          color: "white",
          padding: "25px 20px",
        }}
      >
        <div className="text-center mb-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpk-XsaGErykwAliZebAqSWQW1Zsukhc2aJw&s"
            alt="profile"
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid #fff",
            }}
          />

          <h4 className="mt-3 mb-1">
            {currentUser?.firstName}
          </h4>

          <small style={{ color: "#9ca3af" }}>
            Manager Panel
          </small>
        </div>

        {/* Attendance Card */}
        <div
          style={{
            background: "#1f2937",
            borderRadius: "15px",
            padding: "18px",
            marginBottom: "25px",
          }}
        >
          <h6 className="mb-3">My Attendance</h6>

          <p className="mb-2">
            Check In :{" "}
            <strong>{checkInTime || "--"}</strong>
          </p>

          <p className="mb-3">
            Check Out :{" "}
            <strong>{checkOutTime || "--"}</strong>
          </p>

          <div className="d-flex gap-2">
            <button
              onClick={handleCheckIn}
              disabled={checkInTime}
              className="btn btn-success btn-sm w-100"
            >
              Check In
            </button>

            <button
              onClick={handleCheckOut}
              disabled={!checkInTime || checkOutTime}
              className="btn btn-danger btn-sm w-100"
            >
              Check Out
            </button>
          </div>
        </div>

        {/* MENU */}
        <div className="d-flex flex-column gap-2">
          {[
            {
              key: "dashboard",
              label: "Dashboard",
            //   icon: "📊",
            },
            {
              key: "employees",
              label: "Employees",
            //   icon: "👥",
            },
            {
              key: "attendance",
              label: "Attendance",
            //   icon: "📅",
            },
            {
              key: "leaves",
              label: "Leaves",
              icon: "📝",
            },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{
                border: "none",
                padding: "12px 15px",
                borderRadius: "12px",
                textAlign: "left",
                background:
                  activeTab === item.key
                    ? "linear-gradient(135deg,#2563eb,#7c3aed)"
                    : "transparent",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
          className="btn btn-light w-100 mt-5"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-grow-1">
        {/* TOPBAR */}
        <div
          style={{
            background:
              "linear-gradient(135deg,#2563eb,#7c3aed)",
            padding: "20px 30px",
            color: "white",
          }}
        >
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="fw-bold mb-1">
                Welcome Back, {currentUser?.firstName}
              </h3>

              <small>
                Manage employees, attendance and leave
                requests
              </small>
            </div>

            <div className="d-flex gap-2">
              <input
                type="text"
                placeholder="Search here..."
                className="form-control"
                style={{
                  minWidth: "250px",
                  borderRadius: "10px",
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4">
          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              {/* STATS */}
              <div className="row g-4 mb-4">
                {[
                  {
                    title: "Total Employees",
                    value: totalEmployees,
                    color: "#2563eb",
                    // icon: "👥",
                  },
                  {
                    title: "Present Today",
                    value: presentToday,
                    color: "#16a34a",
                    icon: "✅",
                  },
                  {
                    title: "Pending Leaves",
                    value: pendingLeaves,
                    color: "#f59e0b",
                    icon: "⏳",
                  },
                  {
                    title: "Approved Leaves",
                    value: approvedLeaves,
                    color: "#7c3aed",
                    icon: "✔",
                  },
                ].map((card, i) => (
                  <div key={i} className="col-md-6 col-xl-3">
                    <div
                      style={{
                        background: "white",
                        borderRadius: "18px",
                        padding: "25px",
                        boxShadow:
                          "0 5px 20px rgba(0,0,0,0.08)",
                        transition: "0.3s",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small
                            style={{ color: "#6b7280" }}
                          >
                            {card.title}
                          </small>

                          <h2
                            className="fw-bold mt-2"
                            style={{ color: card.color }}
                          >
                            {card.value}
                          </h2>
                        </div>

                        <div
                          style={{
                            fontSize: "35px",
                          }}
                        >
                          {card.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RECENT LEAVES */}
              <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: "20px" }}
              >
                <div className="card-body">
                  <h4 className="fw-bold mb-4">
                    Recent Leave Requests
                  </h4>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Days</th>
                          <th>Period</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {leaves.slice(0, 5).map((l) => (
                          <tr key={l.id}>
                            <td className="fw-semibold">
                              {l.name}
                            </td>

                            <td>
                              <span
                                className={`badge ${
                                  l.type === "free"
                                    ? "bg-success"
                                    : "bg-warning text-dark"
                                }`}
                              >
                                {l.type}
                              </span>
                            </td>

                            <td>{l.days}</td>

                            <td>
                              {l.start} - {l.end}
                            </td>

                            <td>
                              <span
                                className={`badge ${
                                  l.status === "approved"
                                    ? "bg-success"
                                    : l.status === "rejected"
                                    ? "bg-danger"
                                    : "bg-warning text-dark"
                                }`}
                              >
                                {l.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* EMPLOYEES */}
          {activeTab === "employees" && (
            <div
              className="card border-0 shadow-sm"
              style={{ borderRadius: "20px" }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                  <h4 className="fw-bold mb-0">
                    Employees
                  </h4>

                  <div className="d-flex gap-2 flex-wrap">
                    <input
                      type="text"
                      placeholder="Search employee..."
                      className="form-control"
                      style={{ width: "220px" }}
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                    />

                    <select
                      className="form-select"
                      style={{ width: "220px" }}
                      value={departmentFilter}
                      onChange={(e) =>
                        setDepartmentFilter(
                          e.target.value
                        )
                      }
                    >
                      <option value="all">
                        All Departments
                      </option>

                      {departments.map((dept, i) => (
                        <option key={i} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Salary</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredEmployees.map((u) => (
                        <tr key={u.id}>
                          <td>{u.id}</td>

                          <td className="fw-semibold">
                            {u.firstName}{" "}
                            {u.lastName || ""}
                          </td>

                          <td>{u.email}</td>

                          <td>{u.department}</td>

                          <td>
                            ₹{" "}
                            {u.salary?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ATTENDANCE */}
          {activeTab === "attendance" && (
            <div
              className="card border-0 shadow-sm"
              style={{ borderRadius: "20px" }}
            >
              <div className="card-body">
                <h4 className="fw-bold mb-4">
                  Today's Attendance
                </h4>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {todayAttendance.map((a) => (
                        <tr key={a.id}>
                          <td className="fw-semibold">
                            {a.name}
                          </td>

                          <td>{a.department}</td>

                          <td>{a.checkIn || "--"}</td>

                          <td>{a.checkOut || "--"}</td>

                          <td>
                            <span
                              className={`badge ${
                                a.checkIn
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {a.checkIn
                                ? "Present"
                                : "Absent"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* LEAVES */}
          {activeTab === "leaves" && (
            <div
              className="card border-0 shadow-sm"
              style={{ borderRadius: "20px" }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                  <h4 className="fw-bold mb-0">
                    Leave Requests
                  </h4>

                  <input
                    type="text"
                    placeholder="Search leave..."
                    className="form-control"
                    style={{ width: "220px" }}
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />
                </div>

                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Reason</th>
                        <th>Period</th>
                        <th>Days</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {leaves
                        .filter((l) =>
                          l.name
                            ?.toLowerCase()
                            .includes(
                              search.toLowerCase()
                            )
                        )
                        .map((l) => (
                          <tr key={l.id}>
                            <td className="fw-semibold">
                              {l.name}
                            </td>

                            <td>
                              <span
                                className={`badge ${
                                  l.type === "free"
                                    ? "bg-success"
                                    : "bg-warning text-dark"
                                }`}
                              >
                                {l.type}
                              </span>
                            </td>

                            <td>
                              {l.reason || "No reason"}
                            </td>

                            <td>
                              {l.start} - {l.end}
                            </td>

                            <td>{l.days}</td>

                            <td>
                              <span
                                className={`badge ${
                                  l.status === "approved"
                                    ? "bg-success"
                                    : l.status === "rejected"
                                    ? "bg-danger"
                                    : "bg-warning text-dark"
                                }`}
                              >
                                {l.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Manager;