function SearchFilter({ keyword, setKeyword }) {
  return (
    <input
      type="text"
      placeholder="Cari kontak..."
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
    />
  );
}
