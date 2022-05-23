// const express = require("express");

import express from "express";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "jkjkhh",
  password: "sbs123414",
  database: "a9",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "https://cdpn.io",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// app.use(cors()); // 모든 타 도메인을 허용
app.use(cors(corsOptions)); // 특정 도메인을 허용
const port = 3000;

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const [rs] = await pool.query(
    `
    DELETE 
    FROM todo
    WHERE id = ?
    `,
    [id]
  );

  res.json({
    msg: `${id}번 할일이 삭제되었습니다.`,
  });
});

app.post("/todos/", async (req, res) => {
  // const { id } = req.params;

  // const [rows] = await pool.query(
  //   `
  //   SELECT *
  //   FROM todo
  //   WHERE id = ?
  //   `,
  //   [id]
  // );

  // if (rows.length == 0) {
  //   res.status(404).json({
  //     msg: "not found",
  //   });
  //   return;
  // }

  const { reg_date, perform_date, is_completed, content } = req.body;

  // if (!perform_date) {
  //   res.status(400).json({
  //     msg: "perform_date required",
  //   });
  //   return;
  // }

  // if (!is_completed) {
  //   res.status(400).json({
  //     msg: "is_completed required",
  //   });
  //   return;
  // }

  // if (!content) {
  //   res.status(400).json({
  //     msg: "content required",
  //   });
  //   return;
  // }

  const [rs] = await pool.query(
    `
    INSERT INTO todo
    SET reg_date = ?, 
    perform_date = ?,
    is_completed = ?,
    content = ?
    `,
    [reg_date, perform_date, is_completed, content]
  );

  res.json({
    msg: `할일이 추가되었습니다.`,
  });
});

app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query(
    `
    SELECT *
    FROM todo
    WHERE id = ?
    `,
    [id]
  );

  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }

  const { perform_date, is_completed, content } = req.body;

  if (!perform_date) {
    res.status(400).json({
      msg: "perform_date required",
    });
    return;
  }

  if (!is_completed) {
    res.status(400).json({
      msg: "is_completed required",
    });
    return;
  }

  if (!content) {
    res.status(400).json({
      msg: "content required",
    });
    return;
  }

  const [rs] = await pool.query(
    `
    UPDATE todo
    SET perform_date = ?,
    is_completed = ?,
    content = ?
    WHERE id = ?
    `,
    [perform_date, is_completed, content, id]
  );

  res.json({
    msg: `${id}번 할일이 수정되었습니다.`,
  });
});

app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query(
    `
    SELECT *
    FROM todo
    WHERE id = ?
    `,
    [id]
  );

  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }

  res.json(rows[0]);
});

app.get("/todos", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM article ORDER BY id DESC");

  res.json(rows);
});

app.listen(port);
