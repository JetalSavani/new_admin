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

export default function Calender() {
  const date = new Date();
  const history = useHistory();
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [totalpage, settotalpage] = useState(0);
  const [currentpage, setcurrentpage] = useState(1);
  const [pagesize, setpagesize] = useState(10);
  const [searching, setsearching] = useState("");
  const [countryData, setCountryData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [newData, setNewData] = useState({
    name: "",
    date: moment(date).format("YYYY-MM-DD"),
    country: "",
    categoryName: "",
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
      text: "Event Name",
      sort: true,
      formatter: (cell, row) => {
        console.log("row", row);

        return (
          <div className="d-flex  align-items-center">
            <div
              className="calender-bg me-2"
              style={{ backgroundColor: `${row?.color}` }}
            ></div>
            {row?.name}
          </div>
        );
      },
    },
    {
      dataField: "categoryName",
      text: "Category Name",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell || "-"}</div>;
      },
    },
    {
      dataField: "date",
      text: "Event Date",
      sort: true,
      formatter: (cell, row) => {
        return <div>{moment(cell).format("DD-MM-YYYY") || "-"}</div>;
      },
    },
    {
      dataField: "country",
      text: "Country",
      sort: true,
      formatter: (cell, row) => {
        return <div>{cell || "-"}</div>;
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
    setIsEdit(true);
    setModal(true);
    setNewData({
      id: row?._id,
      name: row?.name,
      date: moment(row?.date).format("YYYY-MM-DD"),
      country: row?.country,
      categoryName: row?.categoryName || "",
      color: row?.color,
    });
  };
  const onDelete = async (Id) => {
    await ApiDelete(`/delete/calender/${Id}`)
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
      name: newData?.name,
      date: moment(newData?.date).format("MM-DD-YYYY"),
      country: newData?.country,
      categoryName: newData?.categoryName,
      color: newData?.color,
    };
    console.log("body", body);
    await ApiPut("/update/calender", body)
      .then((res) => {
        SuccessToast(res?.data?.message);
        setModal(false);
        fetchData(currentpage, pagesize, searching);
      })
      .catch((err) => ErrorToast(err?.message));
  };
  const handleSubmit = async () => {
    let body = {
      name: newData?.name,
      date: moment(newData?.date).format("MM-DD-YYYY"),
      country: newData?.country,
      categoryName: newData?.categoryName,
      color: newData?.color,
    };
    console.log("body", body);
    await ApiPost("/add/calender", body)
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
    await ApiUpload("upload/image/profile_image", formData)
      .then((res) => {
        setNewData({ ...newData, thumbnailUrl: res?.data?.data?.image });
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
    await ApiGet("/get/category")
      .then((res) => {
        console.log("res?.data?.data?.response", res?.data?.data);
        setCategoryData(res?.data?.data);
        // setCountryData(res?.data?.data?.response);
      })
      .catch((err) => ErrorToast(err?.message));
  };
  const fetchData = async (page, limit, search) => {
    let body = { page, limit, search };
    await ApiPost("/get/calender", body)
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
          <div className="fs-20px fw-bolder">Calender List</div>
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
              Calender
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
                    date: moment(new Date()).format("YYYY-MM-DD"),
                    country: "",
                    categoryName: "",
                  });
                }}
              >
                Add Calender
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
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Event Name"
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
                {/* {newData.date?.length > 0 ? "" : errors["date"]} */}
              </span>
            </Form.Group>

            <Form.Group className="col-md-12">
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
              {/* <span className="errorInput">
                {data.playlist?.length > 0 ? "" : errors["playlist"]}
              </span> */}
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
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="color"
                placeholder="Enter color"
                label="color"
                id="color"
                required
                name="color"
                role="button"
                onChange={handleChange}
                value={newData.color}
              />
              <span className="errorInput">
                {/* {newData.date?.length > 0 ? "" : errors["date"]} */}
              </span>
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
    </>
  );
}
