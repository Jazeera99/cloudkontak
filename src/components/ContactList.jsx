// C:\apps\www\cloudkontak\src\components\ContactList.jsx
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import "./ContactList.css";
import ModalLabel from "./Modal/Label.jsx";

const MAX_FAVORITE = 5;

function ContactList({ contacts, setContacts, onEdit, onDelete, onChangeLabel, onToggleFavorite }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [activeRow, setActiveRow] = useState(null);
  const [labelModal, setLabelModal] = useState({ open: false, contact: null });
  const [labelEditRow, setLabelEditRow] = useState(null);
  const [openMenuMobile, setOpenMenuMobile] = useState(null); // null atau id kontak

  // Responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    let data = contacts;
    if (globalFilter) {
      data = data.filter((c) =>
        (c.nama || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
        (c.no_hp || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
        (c.alamat || "").toLowerCase().includes(globalFilter.toLowerCase())
      );
    }
    // Favorite ke atas, lalu urut nama
    return [...data].sort((a, b) => {
      if (b.favorite === true && a.favorite !== true) return 1;
      if (a.favorite === true && b.favorite !== true) return -1;
      // Jika sama-sama favorite atau sama-sama bukan, urut nama
      return (a.nama || "").localeCompare(b.nama || "");
    });
  }, [contacts, globalFilter]);

  const handleShowDetail = id => setActiveRow(id);
  const handleHideDetail = () => setActiveRow(null);

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "nama",
        cell: ({ row }) => (
          <div className="contact-info">
            <span
              className="avatar-clickable"
              title="Lihat detail"
              onMouseEnter={() => isMobile && handleShowDetail(row.original._id)}
              onTouchStart={() => isMobile && handleShowDetail(row.original._id)}
              onMouseLeave={() => isMobile && handleHideDetail()}
              style={{ marginRight: 8 }}
            >
              {row.original.avatar ? (
                <img
                  src={row.original.avatar}
                  alt={row.original.nama}
                  className="avatar"
                />
              ) : (
                <div className="avatar avatar-initials">
                  {row.original.nama?.slice(0, 2).toUpperCase()}
                </div>
              )}
            </span>
            <span className="contact-name"
              style={{
                flex: 1,
                cursor: "pointer",
                color: "#1976d2"
              }}
              title="Edit kontak"
              onClick={() => onEdit(row.original)}
            >
              {row.original.nama}
            </span>
            {/* Bintang favorite di mobile - tampilkan di sebelah kanan */}
            {isMobile && (
              <span
                className="favorite-star favorite-star-mobile"
                title={row.original.favorite ? "Unfavorite" : "Jadikan Favorite"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavoriteWithLimit(row.original);
                }}
                style={{
                  color: row.original.favorite ? "#FFD600" : "#bbb",
                  fontSize: 24,
                  cursor: "pointer",
                  marginLeft: "auto",
                  paddingLeft: 12,
                  verticalAlign: "middle",
                  userSelect: "none",
                  flexShrink: 0
                }}
              >
                {row.original.favorite ? "★" : "☆"}
              </span>
            )}
          </div>
        ),
        meta: { align: "center" },
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: info => info.getValue(),
        meta: { align: "center" },
      },
      {
        header: "Phone number",
        accessorKey: "no_hp",
        cell: info => info.getValue(),
        meta: { align: "center" },
      },
      {
        header: "Address",
        accessorKey: "alamat",
        cell: info => info.getValue(),
        meta: { align: "center" },
      },
      {
        header: "Aksi",
        id: "aksi",
        cell: ({ row }) => {
          const [openMenu, setOpenMenu] = React.useState(false);
          const menuRef = React.useRef();

          // Tutup menu jika klik di luar
          React.useEffect(() => {
            if (!openMenu) return;
            function handleClick(e) {
              if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false);
              }
            }
            document.addEventListener("mousedown", handleClick);
            return () => document.removeEventListener("mousedown", handleClick);
          }, [openMenu]);

          if (isMobile) return null;

          return (
            <div style={{ position: "relative", textAlign: "center" }}>
              <button
                className="aksi-dot-btn"
                onClick={() => setOpenMenu(v => !v)}
                title="Aksi"
                aria-label="Aksi"
              >
                &#8942;
              </button>
              {openMenu && (
                <div className="aksi-popup-menu" ref={menuRef}>
                  <button
                    className="btn-delete"
                    onClick={() => {
                      setOpenMenu(false);
                      onDelete(row.original);
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>Delete</span>
                  </button>
                  <div className="label-section">
                    <div className="label-title">Label:</div>
                    <div className="label-options">
                      {["Teman", "Keluarga", "Kerja", ""].map(label => (
                        <div
                          key={label}
                          className={`label-item${row.original.label === label ? " label-item-active" : ""}`}
                          onClick={() => {
                            onChangeLabel(row.original, label);
                            setOpenMenu(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            cursor: "pointer",
                            fontWeight: row.original.label === label ? "bold" : "normal",
                            color: row.original.label === label ? "#1976d2" : "#333",
                            marginBottom: 5,
                          }}
                        >
                          {row.original.label === label && (
                            <span style={{ color: "#1976d2", fontSize: 16 }}>✔</span>
                          )}
                          {label === "" ? "Tanpa Label" : label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        },
        meta: { align: "center" },
      },
      {
        header: "",
        id: "favorite",
        cell: ({ row }) => (
          <span
            className="favorite-star favorite-star-desktop"
            title={row.original.favorite ? "Unfavorite" : "Jadikan Favorite"}
            onClick={() => handleToggleFavoriteWithLimit(row.original)}
            style={{
              color: row.original.favorite ? "#FFD600" : "#bbb",
              fontSize: 22,
              cursor: "pointer",
              marginRight: 4,
              verticalAlign: "middle",
              userSelect: "none"
            }}
          >
            {row.original.favorite ? "★" : "☆"}
          </span>
        ),
        meta: { align: "center" },
      },
    ],
    [onEdit, onDelete, contacts, onToggleFavorite]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { pagination: { pageIndex, pageSize } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    pageCount: Math.ceil(filteredData.length / pageSize),
  });

  // Info paging
  const start = filteredData.length === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, filteredData.length);

  // Fungsi pembungkus untuk membatasi favorite
  const handleToggleFavoriteWithLimit = (contact) => {
    if (!contact.favorite) {
      const favCount = contacts.filter(c => c.favorite).length;
      if (favCount >= MAX_FAVORITE) {
        alert("Maaf, maksimum hanya 5 kontak yang bisa dijadikan favorite.");
        return;
      }
    }
    onToggleFavorite(contact);
  };

  return (
    <div className="contact-list-container">
      <div className="dt-toolbar">
        <div>
          Tampilkan{" "}
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setPageIndex(0);
            }}
            style={{ margin: "0 4px" }}
          >
            {[5, 10, 25, 50, 100].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>{" "}
          entri
        </div>
      </div>
      <table className="contact-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {isMobile
                ? headerGroup.headers
                    .filter(header => header.column.id === "nama")
                    .map(header => (
                      <th
                        key={header.id}
                        style={{ textAlign: header.column.columnDef.meta?.align || "left" }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))
                : headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      style={{ textAlign: header.column.columnDef.meta?.align || "left" }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort?.() && (
                        <span
                          style={{
                            marginLeft: 4,
                            cursor: "pointer",
                            color: header.column.getIsSorted()
                              ? "#1976d2"
                              : "#bbb",
                            userSelect: "none",
                          }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.column.getIsSorted() === "asc"
                            ? " ▲"
                            : header.column.getIsSorted() === "desc"
                            ? " ▼"
                            : " ⇅"}
                        </span>
                      )}
                    </th>
                  ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={isMobile ? 1 : columns.length} style={{ textAlign: "center" }}>
                Tidak ada data
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <React.Fragment key={row.id}>
                <tr
                  onMouseEnter={() => isMobile && setActiveRow(row.original._id)}
                  onTouchStart={() => isMobile && setActiveRow(row.original._id)}
                  onMouseLeave={() => isMobile && setActiveRow(null)}
                >
                  {isMobile
                    ? row.getVisibleCells()
                        .filter(cell => cell.column.id === "nama")
                        .map(cell => (
                          <td
                            key={cell.id}
                            style={{
                              textAlign: cell.column.columnDef.meta?.align || "left",
                              verticalAlign: "middle",
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))
                    : row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          style={{
                            textAlign: cell.column.columnDef.meta?.align || "left",
                            verticalAlign: "middle",
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                </tr>
                {isMobile && activeRow === row.original._id && (
                  <tr className="mobile-detail-row">
                    <td colSpan={1}>
                      <table className="mobile-profile-table">
                        <tbody>
                          <tr>
                            <td className="profile-label">Email</td>
                            <td className="profile-value">{row.original.email}</td>
                          </tr>
                          <tr>
                            <td className="profile-label">No HP</td>
                            <td className="profile-value">{row.original.no_hp}</td>
                          </tr>
                          <tr>
                            <td className="profile-label">Alamat</td>
                            <td className="profile-value">{row.original.alamat}</td>
                          </tr>
                          {/* Hapus baris aksi di mobile */}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
      {/* Paging mirip DataTables */}
      <div className="dt-footer">
        <div>
          Menampilkan {start} sampai {end} dari {filteredData.length} entri
        </div>
        <div className="dt-pagination">
          <button onClick={() => setPageIndex(0)} disabled={pageIndex === 0}>
            {"<<"}
          </button>
          <button
            onClick={() => setPageIndex(old => Math.max(0, old - 1))}
            disabled={pageIndex === 0}
          >
            {"<"}
          </button>
          <span>
            Halaman <strong>{pageIndex + 1}</strong> dari <strong>{table.getPageCount()}</strong>
          </span>
          <button
            onClick={() => setPageIndex(old => Math.min(table.getPageCount() - 1, old + 1))}
            disabled={pageIndex >= table.getPageCount() - 1}
          >
            {">"}
          </button>
          <button
            onClick={() => setPageIndex(table.getPageCount() - 1)}
            disabled={pageIndex >= table.getPageCount() - 1}
          >
            {">>"}
          </button>
        </div>
      </div>
      {/* Modal untuk ubah label (jika perlu) */}
      <ModalLabel
        open={labelModal.open}
        contact={labelModal.contact}
        onClose={() => setLabelModal({ open: false, contact: null })}
        onChangeLabel={(contact, label) => {
          onChangeLabel(contact, label);
          setLabelModal({ open: false, contact: null });
        }}
      />
      <style>{`
        .contact-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
        }
        .contact-table th, .contact-table td {
          border-bottom: 1px solid #e0e0e0;
          padding: 8px 12px;
        }
        .contact-table th {
          background: #fff;
          font-weight: bold;
        }
        .contact-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          background: #eee;
          display: inline-block;
        }
        .avatar-initials {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #1976d2;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
        }
        .btn-edit, .btn-delete {
          border: none;
          border-radius: 6px;
          padding: 4px 14px;
          font-size: 15px;
          cursor: pointer;
        }
        .btn-edit {
          background: #e3f0fd;
          color: #1976d2;
        }
        .btn-delete {
          background: #fde3e3;
          color: #d32f2f;
        }
        .btn-edit:hover {
          background: #1976d2;
          color: #fff;
        }
        .btn-delete:hover {
          background: #d32f2f;
          color: #fff;
        }
        .dt-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .dt-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          font-size: 14px;
        }
        .dt-pagination button {
          margin: 0 2px;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid #bbb;
          background: #fff;
          cursor: pointer;
        }
        .dt-pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .dt-pagination span {
          margin: 0 8px;
        }
        .mobile-detail-row {
          background: #f8f8f8;
        }
        .mobile-profile-table {
          width: 100%;
        }
        .profile-label {
          font-weight: bold;
          width: 90px;
          color: #1976d2;
        }
        .profile-value {
        } color: #333;
        .aksi-dot-btn {
          background: none;
          border: none;
          font-size: 22px;
          cursor: pointer;
          padding: 2px 8px;
          color: #1976d2;
          border-radius: 4px;
          transition: background 0.15s;
        }
        .aksi-dot-btn:hover {
          background: #e3f0fd;
        }
        .aksi-popup-menu {
          position: absolute;
          right: 0;
          top: 32px;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.10);
          z-index: 10;
          min-width: 150px;
          display: flex;
          flex-direction: column;
          padding: 8px 0 10px 0;
        }
        .aksi-popup-menu .btn-delete {
          color: #d32f2f;
          font-weight: 500;
          border: none;
          background: none;
          padding: 10px 18px 8px 18px;
          text-align: left;
          font-size: 15px;
          cursor: pointer;
          border-radius: 0;
          width: 100%;
          transition: background 0.15s;
        }
        .aksi-popup-menu .btn-delete:hover {
          background: #d32f2f !important;
          color: #fff !important;
        }
        .label-section {
          padding: 6px 18px 0 18px;
        }
        .label-title {
          font-weight: 600;
          color: #1976d2;
          margin-bottom: 6px;
          font-size: 14px;
        }
        .label-options {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .label-options label {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 5px;
          font-size: 15px;
          cursor: pointer;
          color: #333;
        }
        .label-options label:last-child {
          margin-bottom: 0;
        }
        .label-options input[type="radio"] {
          accent-color: #1976d2;
        }
        /* Tambahkan di dalam tag <style> di ContactList.jsx, atau di ContactList.css jika terpisah */
        .theme-dark .contact-table th,
        .theme-dark .contact-table td,
        .theme-dark .profile-label,
        .theme-dark .profile-value,
        .theme-dark .contact-name,
        .theme-dark .label-title,
        .theme-dark .label-options,
        .theme-dark .dt-footer,
        .theme-dark .dt-toolbar,
        .theme-dark .favorite-star,
        .theme-dark .dt-pagination span,
        .theme-dark .dt-pagination button,
        .theme-dark select,
        .theme-dark option,
        .theme-dark input,
        .theme-dark .aksi-dot-btn {
          color: #fff !important;
          background: transparent !important;
          border-color: #444 !important;
        }

        .theme-dark select,
        .theme-dark input {
          background: #263043 !important;
          color: #fff !important;
          border: 1px solid #444 !important;
        }

        .theme-dark .dt-toolbar,
        .theme-dark .dt-footer {
          background: transparent !important;
        }

        .theme-dark .dt-toolbar > div,
        .theme-dark .dt-footer > div:first-child {
          background: #fff !important;
          color: #111 !important;
          border-radius: 4px;
          padding: 2px 8px;
          display: inline-block;
        }

        .theme-dark .dt-pagination button {
          background: #263043 !important;
          color: #fff !important;
          border: 1px solid #444 !important;
        }

        .theme-dark .dt-pagination button:disabled {
          opacity: 0.5;
          color: #bbb !important;
        }

        .theme-dark .dt-pagination span {
          color: #111 !important;
        }

        .theme-dark .aksi-dot-btn {
          background: #263043 !important;
          color: #fff !important;
        }

        .theme-dark .contact-table th {
          background: #263043 !important;
          color: #ffe082 !important;
        }

        .theme-dark .contact-table {
          background: #222b3a !important;
        }

        .theme-dark .contact-info .avatar-initials {
          background: #1976d2;
          color: #fff;
        }

        .theme-dark .aksi-popup-menu {
          background: #263043 !important;
          color: #fff !important;
          border-color: #444 !important;
          box-shadow: 0 2px 12px rgba(0,0,0,0.25) !important;
        }

        .theme-dark .aksi-popup-menu .btn-delete {
          background: transparent !important;
          color: #ff7675 !important;
        }

        .theme-dark .aksi-popup-menu .btn-delete:hover {
          background: #d32f2f !important;
          color: #fff !important;
        }

        .theme-dark .aksi-popup-menu .label-section {
          background: transparent !important;
        }

        .theme-dark .favorite-star {
          color: #FFD600 !important;
          text-shadow: none !important;
        }

        .theme-dark .label-item-active {
          color: #ffe082 !important;
        }
        .theme-dark .mobile-profile-table .profile-label,
        .theme-dark .mobile-profile-table .profile-value {
          color: #111 !important;
        }
        .theme-dark .mobile-detail-row .profile-label,
        .theme-dark .mobile-detail-row .profile-value {
          color: #111 !important;
        }
        .theme-dark input::placeholder {
          color: #fff !important;
          opacity: 1 !important;
        }
        .theme-dark .contact-table td .contact-name {
          cursor: pointer;
          transition: color 0.15s;
        }

        .theme-dark .contact-table td .contact-name:hover {
          color: #ffe082 !important; /* kuning */
        }

        .theme-dark .aksi-popup-menu .label-options .label-item {
          color: #fff !important;
        }

        .theme-dark .aksi-popup-menu .label-title {
          color: #fff !important;
        }
      `}</style>
      <style>{`
        @media (min-width: 600px) {
          .favorite-star-mobile {
            display: none !important;
          }
        }
        @media (max-width: 599px) {
          .favorite-star-desktop {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
export default ContactList;