import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import SVG from "react-inlinesvg";
import NoDataTable from "../../../common/noDataTable";
import Pagination from "@material-ui/lab/Pagination";
import {
  ApiDelete,
  ApiGet,
  ApiPost,
  ApiPut,
  ApiUpload,
} from "../../../helpers/API/ApiData";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import moment from "moment";
import { Dropdown, Form, Modal } from "react-bootstrap";
import Select from "react-select";
import { AiFillEye } from "react-icons/ai";

export default function User() {
  const date = new Date();
  const history = useHistory();
  const [data, setData] = useState([]);
  console.log("data", data);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [totalpage, settotalpage] = useState(0);
  const [currentpage, setcurrentpage] = useState(1);
  const [pagesize, setpagesize] = useState(10);
  const [searching, setsearching] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [newData, setNewData] = useState({
    name: "",
    categoryData: "640f478bd0cf447b327fa6cf",
    date: moment(date).format("YYYY-MM-DD"),
    country: "",
  });
  console.log("newData", newData);
  const [viewData, setViewData] = useState({});

  const columns = [
    {
      dataField: "_id",
      text: "ID",
      formatter: (cell, row, i) => {
        return <div className="d-flex align-items-center">{i + 1 || "-"}</div>;
      },
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell}</div>;
      },
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
      formatter: (cell, row) => {
        console.log("row", row);
        return <div>{cell}</div>;
      },
    },
    {
      dataField: "phone",
      text: "Phone NO.",
      sort: true,
      formatter: (cell, row) => {
        console.log("row", row);
        return <div>{cell || "-"}</div>;
      },
    },
    {
      dataField: "role",
      text: "Role",
      sort: true,
      formatter: (cell, row) => {
        console.log("row", row);
        return <div>{row?.role?.role || "-"}</div>;
      },
    },
    {
      dataField: "action",
      text: "Action",
      sort: true,
      formatter: (cell, row) => {
        return (
          <>
            <a
              title="View User"
              className="btn btn-icon btn-light btn-hover-primary btn-sm me-3"
              onClick={() => viewBtnClick(row)}
            >
              <span className="svg-icon svg-icon-md svg-icon-primary eye-icon">
                <AiFillEye className="" />
              </span>
            </a>
            {/* <a
              title="Edit customer"
              className="btn btn-icon btn-light btn-hover-primary btn-sm me-3"
              onClick={() => editBtnClick(row)}
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/Write.svg"
                  )}
                />
              </span>
            </a> */}

            {/* <a
              title="Delete customer"
              className="btn btn-icon btn-light btn-hover-danger btn-sm"
              onClick={() => {
                Swal.fire({
                  text: `Are you sure you want to Delete ?`,
                  icon: "warning",
                  showCancelButton: true,
                  showConfirmButton: true,
                  confirmButtonText: `Yes, Delete`,
                  confirmButtonColor: "#D72852",
                  cancelButtonColor: "transparent",
                  cancelButtonText: "No, Cancel",
                }).then((res) => {
                  if (res.isConfirmed) {
                    onDelete(row?._id, row?.categoryId?._id);
                  }
                });
              }}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                />
              </span>
            </a> */}
          </>
        );
      },
    },
  ];

  const viewBtnClick = (row) => {
    // setIsEdit(true);
    setViewModal(true);
    setViewData(row);
    console.log(row);
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setNewData({ ...newData, [name]: value });
  };
  console.log("newData", newData);
  const editBtnClick = (row) => {
    console.log("row", row);
    setIsEdit(true);
    setModal(true);
    setNewData({
      id: row?._id,
      name: row?.name,
    });
  };
  const onDelete = async (Id, categoryId) => {
    await ApiDelete(`/color/delete-color?id=${Id}&categoryId=${categoryId}`)
      .then(() => {
        Swal.fire({
          text: "You have Deleted Successfully!!!",
          icon: "success",
          confirmButtonText: "Ok, Got it!",
          confirmButtonColor: "#338DE6",
        });
        // getColor();
      })
      .catch((err) => ErrorToast(err?.message));
  };
  const onUpdate = async () => {
    let body = {
      id: newData?.id,
      name: newData?.name,
    };
    console.log("body", body);
    await ApiPut("/category/update-category", body)
      .then((res) => {
        SuccessToast(res?.data?.message);
        setModal(false);
      })
      .catch((err) => ErrorToast(err?.message));
  };
  const handleSubmit = async () => {
    let body = {
      name: newData?.name,
      categoryId: newData?.categoryName ?? "640f478bd0cf447b327fa6cf",
    };

    await ApiPost("/color/add-color", body)
      .then((res) => {
        SuccessToast(res?.data?.message);
        setModal(false);
        // getCategory();
        // getColor();
      })
      .catch((err) => ErrorToast(err?.message));
  };
  const handleonchnagespagination = (e) => {
    setpagesize(e.target.value);
    setcurrentpage(1);
  };
  const onPaginationChange = (e, i) => {
    setcurrentpage(i);
  };
  const imageChange = async (e) => {
    let file = e.target.files[0];
    let fileURL = URL.createObjectURL(file);
    file.fileURL = fileURL;
    let formData = new FormData();
    formData.append("image", file);
    await ApiUpload("upload/image/profile_image", formData)
      .then((res) => {
        setNewData({ ...newData, thumbnailUrl: res?.data?.data?.image });
      })
      .catch((err) => console.log("res_blob", err));
  };
  const handlesearch = (e) => {
    setsearching(e.target.value);
  };
  const getUser = async () => {
    await ApiGet("/superAdmin/get-all-user")
      .then((res) => {
        console.log("res?.data", res?.data);
        setData(res?.data?.user);
      })
      .catch((err) => ErrorToast(err?.message));
  };
  const getCategory = async () => {
    await ApiGet("/category/get-category")
      .then((res) => {
        console.log("res?.data", res?.data);
        setCategoryData(res?.data?.category);
        // setNewData({ ...newData, categoryData: res?.data?.category });
      })
      .catch((err) => ErrorToast(err?.message));
  };
  useEffect(() => {
    getUser();
    getCategory();
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <div className="title">
          <div className="fs-20px fw-bolder">User List</div>
          <div>
            <span
              role="button"
              onClick={() => history.push("/dashboard")}
              className="text-hover-info text-muted"
            >
              Home
            </span>{" "}
            -{" "}
            <span className="text-muted" role="button">
              {" "}
              User
            </span>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column flex-column-fluid h-100" id="kt_content">
        <div class="card card-custom">
          <div class="card-header flex-wrap border-0 pt-6 pb-0 w-100">
            <div class="card-title ">
              {/* <h3 class="card-label">Video Playlist</h3> */}
              <div class="input-icon">
                <input
                  type="text"
                  class="form-control bg-light"
                  name="searchText"
                  placeholder="Search by Name"
                  value={searching}
                  onChange={(e) => handlesearch(e)}
                  id="kt_datatable_search_query"
                />
                <span>
                  <i class="flaticon2-search-1 text-muted"></i>
                </span>
              </div>
            </div>

            {/* <div class="card-toolbar">
              <a
                class="btn btn-color font-weight-bolder btn-sm ms-4"
                onClick={() => {
                  setIsEdit(false);
                  setModal(true);
                  setNewData({
                    name: "",
                  });
                }}
              >
                Add Color
              </a>
            </div> */}
          </div>
          <div className="card-body mb-5">
            <BootstrapTable
              wrapperClasses="table-responsive"
              headerWrapperClasses="border-0"
              bordered={false}
              classes="table table-head-custom table-vertical-center overflow-hidden"
              bootstrap4
              keyField="_id"
              // selectRow={selectRow}
              data={data || []}
              columns={columns}
              // pagination={paginationFactory(options)}
              // defaultSorted={defaultSorted}
              noDataIndication={() => <NoDataTable />}
              // filter={filterFactory()}
            />
            <div class="d-flex justify-content-between  pt-10">
              <div className="my-2">
                <Pagination
                  count={totalpage}
                  page={currentpage}
                  onChange={onPaginationChange}
                  variant="outlined"
                  shape="rounded"
                  className="pagination_"
                />
              </div>
              <div class="my-2">
                <div class="d-flex align-items-center pagination-drpdown">
                  <select
                    class="form-control pagination-drpdown1 dropdownPage"
                    id="kt_datatable_search_status"
                    onChange={(e) => handleonchnagespagination(e)}
                    value={pagesize}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={modal} onHide={() => setModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <Form.Group className="col-md-12">
              <Form.Label>Select Animal</Form.Label>
              <Form.Control
                as="select"
                custom
                id="category"
                required
                className="form-control"
                name="categoryName"
                onChange={handleChange}
                value={newData.categoryName}
              >
                {/* <option value="" disabled>
                  Select category
                </option> */}
                {categoryData?.map((v, i) => {
                  return (
                    <>
                      <option value={v?._id}>{v?.name}</option>
                    </>
                  );
                })}
              </Form.Control>
              {/* <span className="errorInput">
                {data.playlist?.length > 0 ? "" : errors["playlist"]}
              </span> */}
            </Form.Group>
            <Form.Group className="col-md-12">
              <Form.Label>Color Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Color Name"
                label="name"
                id="name"
                required
                name="name"
                onChange={handleChange}
                value={newData.name}
              />
              <span className="errorInput">
                {/* {newData.name?.length > 0 ? "" : errors["name"]} */}
              </span>
            </Form.Group>
            {/* <Form.Group className="col-md-12">
              <Form.Label>Event Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter Date"
                label="date"
                id="date"
                required
                name="date"
                role="button"
                onChange={handleChange}
                value={newData.date}
              />
              <span className="errorInput">
              </span>
            </Form.Group> */}

            {/* <Form.Group className="col-md-12">
              <Form.Label>Country</Form.Label>
              <Form.Control
                as="select"
                custom
                id="country"
                required
                className="form-control"
                name="country"
                onChange={handleChange}
                value={newData.country}
              >
                <option value="" disabled>
                  Select country
                </option>
                {countryData?.map((v, i) => {
                  return (
                    <>
                      <option value={v?.countryName}>{v?.countryName}</option>
                    </>
                  );
                })}
              </Form.Control>
            </Form.Group> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {isEdit ? (
            <button className="btn btn-color" onClick={onUpdate}>
              Update Changes
            </button>
          ) : (
            <button className="btn btn-color" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </Modal.Footer>
      </Modal>
      <Modal
        show={viewModal}
        onHide={() => setViewModal(false)}
        centered
        className="modal-width"
      >
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="text-center" style={{ marginBottom: "1.75rem" }}>
              <img
                src={
                  viewData?.image ||
                  "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                }
                alt=""
                className=" rounded-pill object-cover"
                height="100px"
                width="100px"
              />
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Name</div>
              <div className="col-md-7 text-capitalize">{viewData?.name}</div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Email</div>
              <div className="col-md-7 text-capitalize">{viewData?.email}</div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Bank Name</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.bankName || "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Account Number</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.accountNumber || "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Ifsc Code</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.ifscCode || "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Phone Number</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.phone || "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Address</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.address || "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">City</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.city || "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">State</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.state || "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Country</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.country || "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Pincode</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.pincode || "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Role</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.role?.role || "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">CreatedAt</div>
              <div className="col-md-7 text-capitalize">
                {moment(viewData?.createdAt).format("DD-MM-YYYY")}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-color" onClick={() => setViewModal(false)}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
