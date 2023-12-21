function generateTable() {
  const jumlahAlternatif = document.getElementById('jumlahAlternatif').value;
  const kolom = 6

  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';
   const tablePeringkat = document.getElementById('tablePeringkat');
  tablePeringkat.innerHTML = '';

  for (let i = 1; i <= jumlahAlternatif; i++) {
    const row = document.createElement('tr');

    // Tambahkan input nama alternatif di kolom pertama
    const cellNamaAlternatif = document.createElement('td');
    const inputNama = document.createElement('input');
    inputNama.setAttribute('placeholder', `Alternatif ${i}`);
    cellNamaAlternatif.appendChild(inputNama);
    row.appendChild(cellNamaAlternatif);

    for (let j = 1; j < kolom; j++) { // Menambah input peringkat di setiap sel
      const cell = document.createElement('td');
      const input = document.createElement('input');
      cell.appendChild(input);
      row.appendChild(cell);
    }

    tableBody.appendChild(row);
  }
}

function calculateValues() {
  const tbodyRows = document.querySelectorAll('tbody tr');
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<strong>Hasil:</strong><br>';

  const jumlahAlternatifInput = document.getElementById('jumlahAlternatif');
  const jumlahAlternatif = parseInt(jumlahAlternatifInput.value);

  tbodyRows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const alternatifName = inputs[0].value;

    const jumlahPeringkat = Math.min(jumlahAlternatif, jumlahAlternatifInput.value);
    console.log(jumlahAlternatif, jumlahAlternatifInput.value)

    const validInputs = Array.from(inputs).slice(1) // Mengambil input peringkat saja
      .filter(input => !isNaN(parseInt(input.value)) && parseInt(input.value) >= 1 && parseInt(input.value) <= jumlahPeringkat);

    const frequency = Array.from({ length: jumlahPeringkat }, () => 0); // Array untuk menyimpan frekuensi peringkat

    validInputs.forEach(input => {
      const value = parseInt(input.value);
      frequency[value - 1]++;
    });

    resultDiv.innerHTML += `${alternatifName}:<br>`;
    for (let i = 0; i < jumlahPeringkat; i++) {
      resultDiv.innerHTML += `- Peringkat ${i + 1}: ${frequency[i]} kali<br>`;
    }
    resultDiv.innerHTML += '<br>';
  });
}

function borda_bobot() {
  var jumlahAlternatif = document.getElementById('jumlahAlternatif').value;
  var headerRow = document.getElementById('headerRow');

  // Bersihkan isi dari headerRow sebelum menambahkan header baru
  headerRow.innerHTML = '';

  // Tambahkan header baru ke dalam headerRow
  for (var j = 1; j <= jumlahAlternatif; j++) {
    var th = document.createElement('th');
    th.textContent = 'Ke-' + j;
    headerRow.appendChild(th);
  }

  // Generate cell inputan untuk 1 baris dengan jumlahAlternatif kolom
  var tablePeringkat = document.getElementById('tablePeringkat');
  tablePeringkat.innerHTML = ''; // Bersihkan tabel sebelum mengisi data baru

  // Logic untuk membuat cell inputan pada tabel tablePeringkat
  var tr = document.createElement('tr');
  for (var k = 0; k < jumlahAlternatif; k++) {
    var td = document.createElement('td');
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'bobotInput_' + k); // Tambahkan ID yang unik
    td.appendChild(input);
    tr.appendChild(td);
  }

  tablePeringkat.appendChild(tr);
}


function save() {
  const tbodyRows = document.querySelectorAll('.borda-matrix tbody tr'); // Memilih tbody dari tabel alternatif
  const resultDiv = document.getElementById('bordaScores');

  const jumlahAlternatifInput = document.getElementById('jumlahAlternatif');
  const jumlahAlternatif = parseInt(jumlahAlternatifInput.value);

  const scores = []; // Array untuk menyimpan skor setiap alternatif

  tbodyRows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const alternatifName = inputs[0].value;

    const jumlahPeringkat = Math.min(jumlahAlternatif, jumlahAlternatifInput.value);

    const validInputs = Array.from(inputs).slice(1) // Mengambil input peringkat saja
      .filter(input => !isNaN(parseInt(input.value)) && parseInt(input.value) >= 1 && parseInt(input.value) <= jumlahPeringkat);

    const frequency = Array.from({ length: jumlahPeringkat }, () => 0); // Array untuk menyimpan frekuensi peringkat

    validInputs.forEach(input => {
      const value = parseInt(input.value);
      frequency[value - 1]++;
    });

    // Menghitung skor berdasarkan bobot peringkat
    let skor = 0;
    for (let i = 0; i < jumlahPeringkat; i++) {
      const bobotInput = document.querySelectorAll('.peringkat_borda tbody tr td input')[i]; // Mengambil bobot dari tabel peringkat
      const bobot = parseInt(bobotInput.value);
      skor += frequency[i] * bobot;
      console.log(frequency[0]);
    }

    // Menambah skor beserta nama alternatif ke dalam array
    scores.push({ name: alternatifName, score: skor });
  });

  // Menentukan peringkat berdasarkan skor tertinggi
  scores.sort((a, b) => b.score - a.score);

  // Menampilkan hasil peringkat
  let ranking = 1;
  scores.forEach(alternatif => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${ranking}</td>
      <td>${alternatif.name}</td>
      <td>${alternatif.score}</td>
    `;
    resultDiv.appendChild(row);
    ranking++;
  });
}