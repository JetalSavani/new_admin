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

export default function SubCategory() {
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
    categoryName: "",
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
      text: "Breed Name",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell}</div>;
      },
    },
    {
      dataField: "name",
      text: "Animal Name",
      sort: true,
      formatter: (cell, row) => {
        console.log("row", row);
        return <div>{row?.categoryId?.name}</div>;
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
            </a>

            <a
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
                    onDelete(row?._id);
                  }
                });
              }}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                />
              </span>
            </a>
          </>
        );
      },
    },
  ];

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
      categoryName: row?.categoryId?._id,
    });
  };
  const onDelete = async (Id) => {
    await ApiDelete(`/subcategory/delete-subcategory?id=${Id}`)
      .then(() => {
        Swal.fire({
          text: "You have Deleted Successfully!!!",
          icon: "success",
          confirmButtonText: "Ok, Got it!",
          confirmButtonColor: "#338DE6",
        });
        getSubCategory();
      })
      .catch((err) => ErrorToast(err?.message));
  };
  const onUpdate = async () => {
    let body = {
      // id: newData?.id,
      name: newData?.name,
    };
    console.log("body", body);
    await ApiPut(`/subcategory/update-subcategory?id=${newData?.id}`, body)
      .then((res) => {
        SuccessToast(res?.data?.message);
        setModal(false);
        getSubCategory();
      })
      .catch((err) => ErrorToast(err?.message));
  };
  const handleSubmit = async () => {
    let body = {
      categoryId: newData?.categoryName ?? "640f478bd0cf447b327fa6cf",
      name: newData?.name,
    };

    await ApiPost("/subcategory/add-subcategory", body)
      .then((res) => {
        SuccessToast(res?.data?.message);
        setModal(false);
        getSubCategory();
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
  const getCategory = async () => {
    await ApiGet("/category/get-category")
      .then((res) => {
        console.log("res?.data", res?.data);
        setCategoryData(res?.data?.category);
      })
      .catch((err) => ErrorToast(err?.message));
  };
  const getSubCategory = async () => {
    await ApiGet("/subcategory/get-subcategory")
      .then((res) => {
        console.log("res?.data", res?.data);
        setData(res?.data?.subcategory);
      })
      .catch((err) => ErrorToast(err?.message));
  };
  useEffect(() => {
    getCategory();
    getSubCategory();
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <div className="title">
          <div className="fs-20px fw-bolder">Breed List</div>
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
              Breed
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

            <div class="card-toolbar">
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
                Add Breed
              </a>
            </div>
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
          <Modal.Title>Add New Breed</Modal.Title>
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
                disabled={isEdit}
              >
                {/* <option value="" disabled>
                  Select Animal
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
              <Form.Label>Breed Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Breed Name"
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
              <div className="col-md-5 fw-bold">First Name</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.firstName}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Last Name</div>
              <div className="col-md-7">{viewData?.lastName}</div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Email</div>
              <div className="col-md-7 text-capitalize">{viewData?.email}</div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">DOB</div>
              <div className="col-md-7 text-capitalize">
                {moment(viewData?.dob).format("DD-MM-YYYY")}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Gender</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.gender === 0 ? "Male" : "Female"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">About Me</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.aboutMe ? viewData?.aboutMe : "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Hobby</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.hobby ? viewData?.hobby : "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Relationship Status </div>
              <div className="col-md-7 text-capitalize">
                {viewData?.relationshipStatus
                  ? viewData?.relationshipStatus === 0
                    ? "Married "
                    : viewData?.relationshipStatus === 1
                    ? "Single"
                    : "Relationship"
                  : "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Shoe Size</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.size?.ShoeSize ? viewData?.size?.ShoeSize : "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Bust</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.size?.Bust ? viewData?.size?.Bust : "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Shirt Size</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.size?.ShirtSize ? viewData?.size?.ShirtSize : "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Dress</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.size?.Dress ? viewData?.size?.Dress : "-"}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Waist</div>
              <div className="col-md-7 text-capitalize">
                {viewData?.size?.Waist ? viewData?.size?.Waist : "-"}
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
