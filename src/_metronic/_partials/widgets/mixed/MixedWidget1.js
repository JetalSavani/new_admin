import React, { useMemo, useEffect, useState } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { useHistory } from "react-router-dom";
import { useHtmlClassService } from "../../../layout";
import { ApiGet } from "../../../../helpers/API/ApiData";
import { ErrorToast, SuccessToast } from "../../../../helpers/Toast";
import { ToastContainer } from "react-toastify";

export function MixedWidget1({ className }) {
  const history = useHistory();
  const [accountdata, setaccountdata] = useState({});
  // const [key, setKey] = useState("Month");
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      colorsGrayGray500: objectPath.get(
        uiService.config,
        "js.colors.gray.gray500"
      ),
      colorsGrayGray200: objectPath.get(
        uiService.config,
        "js.colors.gray.gray200"
      ),
      colorsGrayGray300: objectPath.get(
        uiService.config,
        "js.colors.gray.gray300"
      ),
      colorsThemeBaseDanger: objectPath.get(
        uiService.config,
        "js.colors.theme.base.danger"
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily"),
    };
  }, [uiService]);

  useEffect(() => {
    const element = document.getElementById("kt_mixed_widget_1_chart");
    const element2 = document.getElementById("kt_mixed_widget_2_chart");
    const element3 = document.getElementById("kt_mixed_widget_3_chart");
    if (!element) {
      return;
    }
    if (!element2) {
      return;
    }
    if (!element3) {
      return;
    }

    const options = getChartOptions(layoutProps);
    const options2 = getChartOptions1(layoutProps);
    const options3 = getChartOptions2(layoutProps);

    const chart = new ApexCharts(element, options);
    const chart2 = new ApexCharts(element2, options2);
    const chart3 = new ApexCharts(element3, options3);

    chart.render();
    chart2.render();
    chart3.render();
    return function cleanUp() {
      chart.destroy();
      chart2.destroy();
      chart3.destroy();
    };
  }, [layoutProps]);

  const fetchData = async () => {
    await ApiGet("/getUser/count")
      .then((res) => {
        console.log("resasd", res?.data?.data?.count);
        setaccountdata(res?.data?.data?.count);
      })
      .catch(async (err) => {
        // ErrorToast(err?.message);
      });
  };
  console.log("accountdata", accountdata);
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      {/* <BreadCrumbs items={dashbord} /> */}
      <div className="d-flex justify-content-between mb-4">
        <div className="title">
          <div className="fs-20px fw-bolder">Dashboard</div>
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
              Dashboard
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className={` ${className} col-xxl-4 col-lg-6 col-md-8 col-sm-12`}>
          <div className="card card-custom bg-gray-100">
            <div className="card-header bg-danger border-0 py-5">
              <div className="card-toolbar"></div>
            </div>
            <div className="card-body p-0 position-relative overflow-hidden">
              <div
                id="kt_mixed_widget_1_chart"
                className="card-rounded-bottom bg-danger"
                style={{
                  height: "200px",
                }}
              ></div>

              <div className="card-spacer mt-n25">
                <div className="row m-0">
                  <div className="col bg-light-primary px-6 py-8 rounded-xl mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
                      <a className="text-primary font-weight-bold font-size-h6 mt-2">
                        {accountdata?.userCount}
                      </a>
                    </span>
                    <a
                      className="text-primary font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/user")}
                    >
                      Users
                    </a>
                  </div>
                  <div className="col bg-light-success px-6 py-8 rounded-xl ms-7 mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-success d-block my-2">
                      <a className="text-success font-weight-bold font-size-h6 mt-2">
                        {accountdata?.calender}
                      </a>
                    </span>
                    <a
                      className="text-success font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/calender")}
                    >
                      Calender
                    </a>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col bg-light-danger px-6 py-8 rounded-xl">
                    <span className="svg-icon svg-icon-3x svg-icon-danger d-block my-2">
                      <a className="text-danger font-weight-bold font-size-h6 mt-2">
                        {accountdata?.reminder}
                      </a>
                    </span>
                    <a
                      className="text-danger font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/reminder")}
                    >
                      Reminder
                    </a>
                  </div>
                  <div className="col bg-light-warning px-6 py-8 rounded-xl ms-7">
                    <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                      <a className="text-warning font-weight-bold font-size-h6 mt-2">
                        {accountdata?.party}
                      </a>
                    </span>
                    <a
                      className="text-warning font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/party")}
                    >
                      Party
                    </a>
                  </div>
                </div>
              </div>

              <div className="resize-triggers">
                <div className="expand-trigger">
                  <div style={{ width: "411px", height: "461px" }} />
                </div>
                <div className="contract-trigger" />
              </div>
            </div>
          </div>
        </div>
        {/* <div className={`${className} col-lg-4 col-xxl-4`}>
          <div className="card card-custom bg-gray-100">
            <div className="card-header border-0 bg-danger py-5">
              <div className="card-toolbar"></div>
            </div>
            <div className="card-body p-0 position-relative overflow-hidden">
              <div
                id="kt_mixed_widget_2_chart"
                className="card-rounded-bottom bg-danger"
                style={{ height: "200px" }}
              ></div>

              <div className="card-spacer mt-n25">
                <div className="row m-0">
                  <div className="col bg-light-warning px-6 py-8 rounded-xl mr-7 mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                      <a className="text-warning font-weight-bold font-size-h6">
                        0
                      </a>
                    </span>
                    <a
                      className="text-warning font-weight-bold font-size-h6"
                      onClick={() => history.push("/category_List")}
                    >
                      Categories
                    </a>
                  </div>
                  <div className="col bg-light-primary px-6 py-8 rounded-xl mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
                      <a className="text-primary font-weight-bold font-size-h6 mt-2">
                        0
                      </a>
                    </span>
                    <a
                      className="text-primary font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/subCategory_List")}
                    >
                      Sub Categories
                    </a>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col bg-light-danger px-6 py-8 rounded-xl mr-7">
                    <span className="svg-icon svg-icon-3x svg-icon-danger d-block my-2">
                      <a className="text-danger font-weight-bold font-size-h6 mt-2">
                        0
                      </a>
                    </span>
                    <a
                      className="text-danger font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/software_List")}
                    >
                      Software
                    </a>
                  </div>
                  <div className="col bg-light-success px-6 py-8 rounded-xl">
                    <span className="svg-icon svg-icon-3x svg-icon-success d-block my-2">
                      <a className="text-success font-weight-bold font-size-h6 mt-2">
                        0
                      </a>
                    </span>
                    <a
                      className="text-success font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/contact_List")}
                    >
                      Inquiry
                    </a>
                  </div>
                </div>
              </div>

              <div className="resize-triggers">
                <div className="expand-trigger">
                  <div style={{ width: "411px", height: "461px" }} />
                </div>
                <div className="contract-trigger" />
              </div>
            </div>
          </div>
        </div>
        <div className={`${className} col-lg-4 col-xxl-4`}>
          <div className="card card-custom bg-gray-100">
            <div className="card-header border-0 bg-danger py-5">
              <div className="card-toolbar"></div>
            </div>
            <div className="card-body p-0 position-relative overflow-hidden">
              <div
                id="kt_mixed_widget_3_chart"
                className="card-rounded-bottom bg-danger"
                style={{ height: "200px" }}
              ></div>

              <div className="card-spacer mt-n25">
                <div className="row m-0">
                  <div className="col bg-light-warning px-6 py-8 rounded-xl mr-7 mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                      <a className="text-warning font-weight-bold font-size-h6">
                        0
                      </a>
                    </span>
                    <a className="text-warning font-weight-bold font-size-h6">
                      Today
                    </a>
                  </div>
                  <div className="col bg-light-primary px-6 py-8 rounded-xl mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
                      <a className="text-primary font-weight-bold font-size-h6 mt-2">
                        0
                      </a>
                    </span>
                    <a className="text-primary font-weight-bold font-size-h6 mt-2">
                      Download
                    </a>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col bg-light-danger px-6 py-8 rounded-xl mr-7">
                    <span className="svg-icon svg-icon-3x svg-icon-danger d-block my-2">
                      <a className="text-danger font-weight-bold font-size-h6 mt-2">
                        0
                      </a>
                    </span>
                    <a className="text-danger font-weight-bold font-size-h6 mt-2">
                      Week
                    </a>
                  </div>
                  <div className="col bg-light-success px-6 py-8 rounded-xl">
                    <span className="svg-icon svg-icon-3x svg-icon-success d-block my-2">
                      <a className="text-success font-weight-bold font-size-h6 mt-2">
                        0
                      </a>
                    </span>
                    <a className="text-success font-weight-bold font-size-h6 mt-2">
                      Download
                    </a>
                  </div>
                </div>
              </div>

              <div className="resize-triggers">
                <div className="expand-trigger">
                  <div style={{ width: "411px", height: "461px" }} />
                </div>
                <div className="contract-trigger" />
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* <div className="row">
        <div className={` ${className} col-lg-4 col-xxl-4`}>
          <div className="card card-custom">
            <div className="card-header border-0">
              <h3 className="card-title font-weight-bolder text-dark">
                Top Categories
              </h3>
              
            </div>

            <div className="card-body pt-2" style={{ height: "448px" }}>
              {category?.length > 0 &&
                category.map((img, i) => (
                  <div className="d-flex align-items-center mb-10">
                    

                    <div className="d-flex flex-column font-weight-bold">
                      <a className="text-dark text-hover-primary mb-1 font-size-lg">
                        {img.name}
                      </a>
                      <span className="text-muted">{img.totalUsed}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className={`${className} col-lg-8 col-xxl-8`}>
          <div className="card card-custom" style={{ paddingBottom: "25px" }}>
            <div className="card-header border-0 pt-5">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label font-weight-bolder text-dark">
                  Approve Post
                </span>
                
              </h3>
              
            </div>
            <div className="card-body pt-3 pb-0">
              <div className="table-responsive">
                <BootstrapTable
                  wrapperClasses="table-responsive"
                  bordered={false}
                  classes="table table-head-custom table-vertical-center overflow-hidden"
                  bootstrap4
                  // remote
                  keyField="id"
                  data={data}
                  columns={columns}
                  // pagination={paginationFactory(options)}
                  defaultSorted={defaultSorted}
                  noDataIndication={() => <NoDataTable />}
                  // filter={filterFactory()}
                  // headerClasses="header-class"
                />
                <center>{data.length > 0 ? null : "No Data"}</center>
                {data.length > 0 ? (
                  <div class="d-flex justify-content-between  pt-10">
                    <div className="my-2">
                      <Pagination
                        count={totalpage}
                        page={currentpage}
                        onChange={handleChange}
                        variant="outlined"
                        shape="rounded"
                        className="pagination_"
                      />
                    </div>
                    <div class="my-2 my-md-0">
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
                ) : null}
                {open && (
                  <Post_Edit
                    open={open}
                    setOpen={setOpen}
                    rowID={rowID}
                    setRowID={setRowID}
                    fetchDatas={callPanding}
                    SetState={setState}
                  />
                )}
                <Modal
                  show={modal}
                  centered
                  onHide={() => setModal(!modal)}
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                      Delete Post
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <span>
                      Are you sure you want to delete this Post permanently?
                    </span>
                  </Modal.Body>
                  <Modal.Footer>
                    <div>
                      <button
                        type="button"
                        onClick={() => setModal(!modal)}
                        className="btn btn-light btn-elevate"
                      >
                        Cancel
                      </button>
                      <> </>
                      <button
                        type="button"
                        onClick={() => deleteTheory(Id)}
                        className="btn btn-primary btn-elevate"
                      >
                        Delete
                      </button>
                    </div>
                  </Modal.Footer>
                </Modal>
                <Modal
                  show={modal1}
                  centered
                  onHide={() => setModal1(!modal1)}
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                      Status has been updated for selected Post
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="form-group">
                      <select
                        className="form-control"
                        value={modelStatus}
                        onChange={(e) => setmodelStatus(e.target.value)}
                      >
                        <option value={"public"}>Public</option>
                        <option value={"request"}>Pending</option>
                        <option value={"reject"}>Reject</option>
                      </select>
                    </div>
                    <div className="col-lg-12">
                      <Form.Group md="12">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                          type="textarea"
                          placeholder="Enter Message...."
                          label="message"
                          id="message"
                          required
                          name="message"
                          onChange={(e) => setmessage(e.target.value)}
                          value={message}
                        />
                      </Form.Group>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <div>
                      <button
                        type="button"
                        onClick={() => setModal1(!modal1)}
                        className="btn btn-light btn-elevate"
                      >
                        Cancel
                      </button>
                      <> </>
                      <button
                        type="button"
                        onClick={() => deleteTheory1(Id)}
                        className="btn btn-primary btn-elevate"
                      >
                        Submit
                      </button>
                    </div>
                  </Modal.Footer>
                </Modal>
               
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}

function getChartOptions(layoutProps) {
  const strokeColor = "#D13647";

  const options = {
    series: [
      {
        name: "Net Profit",
        data: [30, 45, 32, 70, 40, 25, 40],
      },
    ],
    chart: {
      type: "area",
      height: 200,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: strokeColor,
        opacity: 0.5,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "solid",
      opacity: 0,
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [strokeColor],
    },
    xaxis: {
      categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: layoutProps.colorsGrayGray300,
          width: 1,
          dashArray: 3,
        },
      },
    },
    yaxis: {
      min: 0,
      max: 80,
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: layoutProps.fontFamily,
      },
      y: {
        formatter: function (val) {
          return "$" + val + " thousands";
        },
      },
      marker: {
        show: false,
      },
    },
    colors: ["transparent"],
    markers: {
      colors: layoutProps.colorsThemeBaseDanger,
      strokeColor: [strokeColor],
      strokeWidth: 3,
    },
  };
  return options;
}
function getChartOptions1(layoutProps) {
  const strokeColor = "#D13647";

  const options = {
    series: [
      {
        name: "Net Profit",
        data: [30, 45, 32, 70, 40, 40, 40],
      },
    ],
    chart: {
      type: "area",
      height: 200,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: strokeColor,
        opacity: 0.5,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "solid",
      opacity: 0,
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [strokeColor],
    },
    xaxis: {
      categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: layoutProps.colorsGrayGray300,
          width: 1,
          dashArray: 3,
        },
      },
    },
    yaxis: {
      min: 0,
      max: 80,
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: layoutProps.fontFamily,
      },
      y: {
        formatter: function (val) {
          return "$" + val + " thousands";
        },
      },
      marker: {
        show: false,
      },
    },
    colors: ["transparent"],
    markers: {
      colors: layoutProps.colorsThemeBaseDanger,
      strokeColor: [strokeColor],
      strokeWidth: 3,
    },
  };
  return options;
}
function getChartOptions2(layoutProps) {
  const strokeColor = "#D13647";

  const options = {
    series: [
      {
        name: "Net Profit",
        data: [30, 45, 32, 70, 40, 40, 40],
      },
    ],
    chart: {
      type: "area",
      height: 200,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: strokeColor,
        opacity: 0.5,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "solid",
      opacity: 0,
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [strokeColor],
    },
    xaxis: {
      categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: layoutProps.colorsGrayGray300,
          width: 1,
          dashArray: 3,
        },
      },
    },
    yaxis: {
      min: 0,
      max: 80,
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: layoutProps.fontFamily,
      },
      y: {
        formatter: function (val) {
          return "$" + val + " thousands";
        },
      },
      marker: {
        show: false,
      },
    },
    colors: ["transparent"],
    markers: {
      colors: layoutProps.colorsThemeBaseDanger,
      strokeColor: [strokeColor],
      strokeWidth: 3,
    },
  };
  return options;
}
