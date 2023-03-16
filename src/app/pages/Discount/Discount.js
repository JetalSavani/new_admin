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
  Bucket,
} from "../../../helpers/API/ApiData";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import moment from "moment";
import { Dropdown, Form, Modal } from "react-bootstrap";
import Select from "react-select";
import { AiFillEye } from "react-icons/ai";

export default function Discount() {
  const date = new Date();
  const history = useHistory();
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [viewData, setViewData] = useState({});
  console.log("viewData[1]", viewData[1]);
  const [viewModal, setViewModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [totalpage, settotalpage] = useState(0);
  const [currentpage, setcurrentpage] = useState(1);
  const [pagesize, setpagesize] = useState(10);
  const [searching, setsearching] = useState("");
  const [countryData, setCountryData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [readMore, setReadMore] = useState(false);
  console.log("first", readMore);
  const [newData, setNewData] = useState({
    image: "",
    name: "",
    discount: "",
    expDate: "",
    categoryName: "",
    description: "",
  });

  const columns = [
    {
      dataField: "_id",
      text: "ID",
      // sort: true,
      formatter: (cell, row, i) => {
        return <div className="d-flex align-items-center">{i + 1 || "-"}</div>;
      },
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      formatter: (cell, row) => {
        return (
          <div>
            <img
              src={
                row?.image
                  ? `${Bucket}/${row?.image}`
                  : "https://static.vecteezy.com/system/resources/thumbnails/014/066/812/small/discount-ribbon-banner-icon-for-graphic-design-logo-website-social-media-mobile-app-ui-illustration-vector.jpg"
              }
              alt=""
              width={50}
              height={50}
              className="rounded"
            />
            <span className="ms-3">{row?.name}</span>
          </div>
        );
      },
    },
    {
      dataField: "discount",
      text: "Discount",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell || "-"}</div>;
      },
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
      formatter: (cell, row) => {
        return (
          <div className="text-truncate" style={{ maxWidth: "250px" }}>
            {cell || "-"}
          </div>
        );
      },
    },
    {
      dataField: "categoryName",
      text: "CategoryName",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell || "-"}</div>;
      },
    },
    {
      dataField: "expDate",
      text: "ExpDate",
      sort: true,
      formatter: (cell, row) => {
        return <div>{moment(cell).format("DD-MM-YYYY") || "-"}</div>;
      },
    },
    // {
    //   dataField: "country",
    //   text: "Country",
    //   sort: true,
    //   formatter: (cell, row) => {
    //     return <div>{cell || "-"}</div>;
    //   },
    // },
    {
      dataField: "action",
      text: "Action",
      sort: true,
      formatter: (cell, row) => {
        return (
          <>
            {/* <a
              title="View User"
              className="btn btn-icon btn-light btn-hover-primary btn-sm me-3"
              onClick={() => viewBtnClick(row)}
            >
              <span className="svg-icon svg-icon-md svg-icon-primary eye-icon">
                <AiFillEye className="" />
              </span>
            </a> */}
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
      image: row?.image,
      name: row?.name,
      discount: row?.discount,
      expDate: moment(row?.expDate).format("YYYY-MM-DD"),
      categoryName: row?.categoryName,
      description: row?.description,
    });
  };
  const onDelete = async (Id) => {
    await ApiDelete(`/delete/discount/${Id}`)
      .then(() => {
        Swal.fire({
          text: "You have Deleted Successfully!!!",
          icon: "success",
          confirmButtonText: "Ok, Got it!",
          confirmButtonColor: "#338DE6",
        });
        fetchData(currentpage, pagesize, searching);
      })
      .catch((err) => ErrorToast(err?.message));
  };
  const onUpdate = async () => {
    let body = {
      id: newData?.id,
      image: newData?.image,
      name: newData?.name,
      discount: newData?.discount,
      expDate: moment(newData?.expDate).format("YYYY-MM-DD"),
      categoryName: newData?.categoryName,
      description: newData?.description,
    };
    console.log("body", body);
    await ApiPut("/update/discount", body)
      .then((res) => {
        SuccessToast(res?.data?.message);
        setModal(false);
        fetchData(currentpage, pagesize, searching);
      })
      .catch((err) => ErrorToast(err?.message));
  };
  const viewBtnClick = (row) => {
    // setIsEdit(true);
    setViewModal(true);
    setViewData([row, row?.createdBy[0]]);
    console.log(row?.createdBy[0]);
    // setNewData({
    //   id: row?._id,
    //   name: row?.eventTypeName,
    //   // date: moment(row?.date).format("YYYY-MM-DD"),
    //   // country: row?.country,
    // });
  };
  const handleSubmit = async () => {
    let body = {
      image: newData?.image,
      name: newData?.name,
      discount: newData?.discount,
      expDate: newData?.expDate,
      categoryName: newData?.categoryName,
      description: newData?.description,
    };

    await ApiPost("/add/discount", body)
      .then((res) => {
        SuccessToast(res?.data?.message);
        setModal(false);
        fetchData(currentpage, pagesize, searching);
      })
      .catch((err) => ErrorToast(err?.message));
  };
  const handleonchnagespagination = (e) => {
    setpagesize(e.target.value);
    setcurrentpage(1);
    fetchData(1, parseInt(e.target.value), searching);
  };
  const onPaginationChange = (e, i) => {
    setcurrentpage(i);
    fetchData(i, pagesize, searching);
  };
  const imageChange = async (e) => {
    let file = e.target.files[0];
    let fileURL = URL.createObjectURL(file);
    file.fileURL = fileURL;
    let formData = new FormData();
    formData.append("image", file);
    await ApiUpload("upload/image/discount", formData)
      .then((res) => {
        setNewData({ ...newData, image: res?.data?.data?.image });
      })
      .catch((err) => console.log("res_blob", err));
  };
  const handlesearch = (e) => {
    setsearching(e.target.value);
    fetchData(currentpage, pagesize, e.target.value);
  };
  const getCountry = async () => {
    let body = {
      page: 1,
      limit: 50,
      search: "",
    };
    await ApiPost("/get/country", body)
      .then((res) => {
        setCountryData(res?.data?.data?.response);
      })
      .catch((err) => ErrorToast(err?.message));
  };
  const getCategory = async () => {
    await ApiGet("/get/discount/category")
      .then((res) => {
        console.log("res?.data?.data?.response", res?.data?.data);
        setCategoryData(res?.data?.data);
        // setCountryData(res?.data?.data?.response);
      })
      .catch((err) => ErrorToast(err?.message));
  };
  const fetchData = async (page, limit, search) => {
    let body = { page, limit, search };
    await ApiPost("/get/discount", body)
      .then((res) => {
        console.log("/workout/get", res?.data?.data);
        setData(res?.data?.data?.response);
        settotalpage(res?.data?.data?.state?.page_limit);
      })
      .catch((err) => ErrorToast(err?.message));
  };
  useEffect(() => {
    fetchData(currentpage, pagesize, searching);
    getCountry();
    getCategory();
  }, []);
  // useEffect(() => {
  //   fetchData(currentpage, pagesize, searching);
  // }, []);
  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <div className="title">
          <div className="fs-20px fw-bolder">Party List</div>
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
              Party
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
                    image: "",
                    name: "",
                    discount: "",
                    expDate: "",
                    categoryName: "",
                    description: "",
                  });
                }}
              >
                Add Discount
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
          <Modal.Title>Add New Calender</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <Form.Group className="col-md-12">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                placeholder=""
                label="name"
                id="image"
                required
                name="image"
                onChange={imageChange}
                value={""}
              />
              <span className="errorInput"></span>
            </Form.Group>
            <Form.Group className="col-md-12">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
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
            <Form.Group className="col-md-12">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Discount"
                label="name"
                id="discount"
                required
                name="discount"
                onChange={handleChange}
                value={newData.discount}
              />
              <span className="errorInput">
                {/* {newData.name?.length > 0 ? "" : errors["name"]} */}
              </span>
            </Form.Group>
            <Form.Group className="col-md-12">
              <Form.Label>Exp Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter Exp Date"
                label="date"
                id="expDate"
                required
                name="expDate"
                onChange={handleChange}
                value={newData.expDate}
              />
              <span className="errorInput"></span>
            </Form.Group>

            <Form.Group className="col-md-12">
              <Form.Label>Category</Form.Label>
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
                <option value="" disabled>
                  Select category
                </option>
                {categoryData?.map((v, i) => {
                  return (
                    <>
                      <option value={v?.categoryName}>{v?.categoryName}</option>
                    </>
                  );
                })}
              </Form.Control>
              {/* <span className="errorInput">
                {data.playlist?.length > 0 ? "" : errors["playlist"]}
              </span> */}
            </Form.Group>
            <Form.Group className="col-md-12">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Description"
                label="date"
                id="description"
                required
                name="description"
                role="expDate"
                onChange={handleChange}
                value={newData.description}
              />
              <span className="errorInput"></span>
            </Form.Group>
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
        onHide={() => {
          setViewModal(false);
          setReadMore(false);
        }}
        centered
        className="modal-width"
      >
        <Modal.Header closeButton>
          <Modal.Title>Party Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="text-center" style={{ marginBottom: "1.75rem" }}>
              <img
                src={
                  viewData[1]?.image ||
                  "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                }
                alt=""
                className=" rounded-pill object-cover"
                height="100px"
                width="100px"
              />
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Party Name</div>
              <div className="col-md-7 text-capitalize">
                {viewData[0]?.partyName}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Party Type </div>
              <div className="col-md-7 text-capitalize">
                {viewData[0]?.partyType}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Party For</div>
              <div className="col-md-7 text-capitalize">
                {viewData[0]?.partyFor}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">RelationShip</div>
              <div className="col-md-7 text-capitalize">
                {viewData[0]?.relationship}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Date</div>
              <div className="col-md-7 text-capitalize">
                {moment(viewData[0]?.date).format("DD-MM-YYYY")}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Time Start</div>
              <div className="col-md-7 text-capitalize">
                {viewData[0]?.timeStart}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Duration</div>
              <div className="col-md-7 text-capitalize">
                {viewData[0]?.duration}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Location</div>
              <div className="col-md-7 text-capitalize">
                {viewData[0]?.location}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Theme</div>
              <div className="col-md-7 text-capitalize">
                {viewData[0]?.theme}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">DressSense</div>
              <div className="col-md-7 text-capitalize">
                {viewData[0]?.dressSense}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Food</div>
              <div className="col-md-7 text-capitalize">
                {viewData[0]?.food}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">SpecialInfo</div>
              <div className="col-md-7 text-capitalize">
                {viewData[0]?.specialInfo}
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-5 fw-bold">Ceated By</div>
              <div className="col-md-7 text-capitalize">
                {viewData[1]?.firstName} {viewData[1]?.lastName}
              </div>
            </div>

            {readMore === true ? (
              <>
                <div className="row py-2">
                  <div className="col-md-5 fw-bold">Email</div>
                  <div className="col-md-7 text-capitalize">
                    {viewData[1]?.email}
                  </div>
                </div>
                <div className="row py-2">
                  <div className="col-md-5 fw-bold">DOB</div>
                  <div className="col-md-7 text-capitalize">
                    {moment(viewData[1]?.dob).format("DD-MM-YYYY")}
                  </div>
                </div>
                <div className="row py-2">
                  <div className="col-md-5 fw-bold">Gender</div>
                  <div className="col-md-7 text-capitalize">
                    {viewData[1]?.gender === 0 ? "Male" : "Female"}
                  </div>
                </div>
                <div className="row py-2">
                  <div className="col-md-5 fw-bold">About Me</div>
                  <div className="col-md-7 text-capitalize">
                    {viewData[1]?.aboutMe ? viewData[1]?.aboutMe : "-"}
                  </div>
                </div>
                <div className="row py-2">
                  <div className="col-md-5 fw-bold">Hobby</div>
                  <div className="col-md-7 text-capitalize">
                    {viewData[1]?.hobby ? viewData[1]?.hobby : "-"}
                  </div>
                </div>
                <div className="row py-2">
                  <div className="col-md-5 fw-bold">Relationship Status </div>
                  <div className="col-md-7 text-capitalize">
                    {viewData[1]?.relationshipStatus
                      ? viewData[1]?.relationshipStatus === 0
                        ? "Married "
                        : viewData[1]?.relationshipStatus === 1
                        ? "Single"
                        : "Relationship"
                      : "-"}
                  </div>
                </div>
                <div className="row py-2">
                  <div className="col-md-5 fw-bold">Shoe Size</div>
                  <div className="col-md-7 text-capitalize">
                    {viewData[1]?.size?.ShoeSize
                      ? viewData[1]?.size?.ShoeSize
                      : "-"}
                  </div>
                </div>
                <div className="row py-2">
                  <div className="col-md-5 fw-bold">Bust</div>
                  <div className="col-md-7 text-capitalize">
                    {viewData[1]?.size?.Bust ? viewData[1]?.size?.Bust : "-"}
                  </div>
                </div>
                <div className="row py-2">
                  <div className="col-md-5 fw-bold">Shirt Size</div>
                  <div className="col-md-7 text-capitalize">
                    {viewData[1]?.size?.ShirtSize
                      ? viewData[1]?.size?.ShirtSize
                      : "-"}
                  </div>
                </div>
                <div className="row py-2">
                  <div className="col-md-5 fw-bold">Dress</div>
                  <div className="col-md-7 text-capitalize">
                    {viewData[1]?.size?.Dress ? viewData[1]?.size?.Dress : "-"}
                  </div>
                </div>
                <div className="row py-2">
                  <div className="col-md-5 fw-bold">Waist</div>
                  <div className="col-md-7 text-capitalize">
                    {viewData[1]?.size?.Waist ? viewData[1]?.size?.Waist : "-"}
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            <div className="row py-2 mt-4">
              {readMore ? (
                <div
                  className="col-md-5 fw-bold fs-3"
                  onClick={() => setReadMore(false)}
                  style={{ cursor: "pointer" }}
                >
                  Read Less...
                </div>
              ) : (
                <div
                  className="col-md-5 fw-bold fs-3"
                  onClick={() => {
                    setReadMore(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Read More...
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-color"
            onClick={() => {
              setViewModal(false);
              setReadMore(false);
            }}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
