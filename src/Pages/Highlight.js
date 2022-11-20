import React, { useState } from "react";
import { paragraph } from "./Paragraphs/Paragraphs";
import DeleteItem from "./DeleteItem";
import Style from "./Highlight.module.css";

const Highlight = ({ children: text = "", tags = [] }) => {
  if (!tags?.length) return text;

  let _tags = [];

  for (let index = 0; index < tags.length; index++) {
    const element = tags[index];

    _tags.push(element.key);
  }

  const matches = [...text.matchAll(new RegExp(_tags.join("|"), "ig"))];
  const startText = text.slice(0, matches[0]?.index);
  return (
    <span>
      {startText}
      {matches.map((match, e) => {
        const startIndex = match.index;
        const getType = tags.filter((tg) => tg.key === match)[0]?.category;
        const currentText = match[0];
        const endIndex = startIndex + currentText.length;

        const nextIndex = matches[e + 1]?.index;

        const untilNextText = text.slice(endIndex, nextIndex);
        console.log(untilNextText);

        return (
          <span key={e}>
            <mark>
              {currentText}
              <span
                style={{
                  color: "yellow",
                  marginRight: 3,
                  border: "1px solid yellow",
                }}
              >
                {getType}
              </span>
            </mark>
            {untilNextText}
          </span>
        );
      })}
    </span>
  );
};
function ParasList({ activeParaId, setPara }) {
  const paragraphHandler = (para) => {
    setPara(para);
  };
  return (
    <ol style={{ listStyle: "upper-roman" }}>
      {paragraph.map((para, i) => (
        <li
          style={{
            cursor: "pointer",
            textAlign: "left",
            padding: 10,
            backgroundColor: activeParaId === para.id && "#ccc",
            border: "1px solid black",
          }}
          key={i}
          onClick={() => paragraphHandler(para)}
        >
          {para.text?.slice(0, 30)}...
        </li>
      ))}
    </ol>
  );
}

export default function MainContainer() {
  let defData = JSON.parse(localStorage.getItem("myItems"));
  let countData = JSON.parse(localStorage.getItem("totalCount"));

  const [selected, setSelected] = useState(defData ? defData : []);
  const [category, setCategory] = useState("person");
  const [isDelete, setIsDelete] = useState(false);
  const [counter, setCounter] = useState(countData ? countData : {});

  const [para, setPara] = useState(paragraph[0]);

  function getSelectedText() {
    let txt = "";
    if (window.getSelection) {
      txt = window.getSelection();
    } else if (window.document.getSelection) {
      txt = window.document.getSelection();
    } else if (window.document.selection) {
      txt = window.document.selection.createRange().text;
    }
    if (txt?.toString().length < 3) {
      return;
    }

    if (txt?.toString().length > 20) {
      return;
    }

    let newArr = [...selected, { key: txt?.toString(), category }];

    localStorage.setItem("myItems", JSON.stringify(newArr));

    let countPerson = newArr?.filter((item) => item?.category === "person");

    let countOrg = newArr?.filter((item) => item?.category === "org");

    let countedeData = {
      countOrg: countOrg?.length,
      countPerson: countPerson?.length,
    };
    localStorage.setItem("totalCount", JSON.stringify(countedeData));

    setCounter(countedeData);

    setSelected(newArr);

    return txt;
  }

  const [deleteIndata, setdeleteIndata] = useState("");

  function deleteIn() {
    let remain = selected?.filter((item) => item.key !== deleteIndata);
    setSelected(remain);
    handleClose();
  }

  function deleteInData(txt) {
    setdeleteIndata(txt);
    setIsDelete(true);
  }

  function handleClose() {
    setIsDelete(false);
  }

  return (
    <div className={Style.mainContainer}>
      {isDelete && <DeleteItem deleteIn={deleteIn} onClose={handleClose} />}

      <div className={Style.divFirst}>
        <div className={Style.cardHeader}>
          <i className="fas fa bar">
            <h1>Records</h1>
          </i>
        </div>
        <ParasList activeParaId={para?.id} setPara={setPara} />
      </div>
      <div className={Style.divTwo}>
        <div
          style={{
            textAlign: "left",
          }}
          className={Style.cardHeader}
        >
          <button
            onClick={() => setCategory("person")}
            type="button"
            style={{
              backgroundColor: category === "person" ? "white" : "",
              border: "1px solid white",
              borderRadius: "5px",
              padding: " 0px 10px",
              color: category === "person" ? "green" : "white",
            }}
          >
            Person
            {counter?.countPerson}
          </button>

          <button
            style={{
              backgroundColor: category === "org" ? "white" : "",
              marginLeft: 10,
              border: "1px solid white",
              borderRadius: "5px",
              padding: " 0px 10px",
              color: category === "org" ? "green" : "white",
            }}
            onClick={() => setCategory("org")}
            type="button"
          >
            Org
            {counter?.countOrg}
          </button>
        </div>

        <h4 onMouseUp={() => getSelectedText()}>
          <Highlight tags={selected}>{para?.text}</Highlight>
        </h4>
      </div>
      <div className={Style.divThird}>
        <div className={Style.cardHeader}>
          <h1>Annotations</h1>
        </div>
        <button
          onClick={() => {
            setSelected([]);
            localStorage.removeItem("myItems");
          }}
          type="button"
          className="ml-2 mt-2  inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          CLEAR ALL
        </button>

        <h1>Selected LIST</h1>

        {selected.length === 0 &&
          "Select your words from the paragraph list..."}
        {selected?.map((item, index) => {
          return (
            <div
              style={{
                width: "100%",
                height: "auto",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                paddingTop: "10px",
              }}
            >
              <p style={{ width: "30%", textAlign: "left" }} key={index}>
                {item.key}
              </p>

              <span
                style={{
                  width: "40px",
                  color: "black",
                  marginLeft: 5,
                }}
              >
                {item.category}
              </span>
              <span
                onClick={() => deleteInData(item.key)}
                style={{ color: "red", marginLeft: 20, cursor: "pointer" }}
              >
                X
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
