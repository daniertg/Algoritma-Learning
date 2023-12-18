function generateTable() {
  const jumlahAlternatif = document.getElementById('jumlahAlternatif').value;
  const kolom = 6;

  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  for (let i = 1; i <= jumlahAlternatif; i++) {
    const row = document.createElement('tr');

    // Tambahkan input nama alternatif di kolom pertama
    const cellNamaAlternatif = document.createElement('td');
    const inputNama = document.createElement('input');
    inputNama.setAttribute('id', `namaAlternatif${i}`);
    inputNama.setAttribute('class', 'namaAlternatif'); // Tambahkan class di sini
    inputNama.setAttribute('placeholder', `Alternatif ${i}`);
    cellNamaAlternatif.appendChild(inputNama);
    row.appendChild(cellNamaAlternatif);

    for (let j = 1; j < kolom; j++) { // Menambah input peringkat di setiap sel
      const cell = document.createElement('td');
      const input = document.createElement('input');
      input.setAttribute('class', 'peringkat'); // Tambahkan class di sini
      cell.appendChild(input);
      row.appendChild(cell);
    }

    tableBody.appendChild(row);
  }
}



function bandingkan() {
  const tableBody2 = document.getElementById('tableBody2');
  tableBody2.innerHTML = '';

  const bordaMatrix1 = getBordaMatrix1();

  // Ambil data dari input nama alternatif di borda-matrix1
  const namaAlternatif = document.querySelectorAll('.namaAlternatif');

  for (let i = 0; i < bordaMatrix1.length - 1; i++) {
    for (let j = i + 1; j < bordaMatrix1.length; j++) {
      const row = document.createElement('tr');

      // Tambahkan nama alternatif di kolom pertama
      const cellNamaAlternatif = document.createElement('td');
      cellNamaAlternatif.textContent = `${namaAlternatif[i].value} vs ${namaAlternatif[j].value}`;
      row.appendChild(cellNamaAlternatif);

      // Tambahkan peringkat dari borda-matrix1
      for (let k = 0; k < bordaMatrix1[i].length; k++) {
        const cell = document.createElement('td');
        cell.textContent = `${bordaMatrix1[i][k]} vs ${bordaMatrix1[j][k]}`;
        row.appendChild(cell);
      }

      // Tentukan pemenang berdasarkan peringkat
      const cellPemenang = document.createElement('td');
      cellPemenang.textContent = bordaMatrix1[i][0] < bordaMatrix1[j][0] ? namaAlternatif[i].value : namaAlternatif[j].value;
      row.appendChild(cellPemenang);

      tableBody2.appendChild(row);
    }
  }
  tampilkanHasilBandingkan();
}



function getBordaMatrix1() {
  const tableBody = document.getElementById('tableBody');
  const rows = tableBody.getElementsByTagName('tr');
  const bordaMatrix1 = [];

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName('td');
    const peringkat = [];

    for (let j = 1; j < cells.length; j++) {
      const input = cells[j].getElementsByTagName('input')[0];
      peringkat.push(Number(input.value) || 0);
    }

    bordaMatrix1.push(peringkat);
  }

  return bordaMatrix1;
}




function hitungHasilBandingkan(bordaMatrix1, namaAlternatif) {
  const hasilBandingkan = {};

  for (let i = 0; i < bordaMatrix1.length - 1; i++) {
    for (let j = i + 1; j < bordaMatrix1.length; j++) {
      const skorCopeland = hitungSkorCopeland(bordaMatrix1[i], bordaMatrix1[j]);
      
      if (!hasilBandingkan[namaAlternatif[i].value]) {
        hasilBandingkan[namaAlternatif[i].value] = { skor: 0, peringkat: 0 };
      }

      if (!hasilBandingkan[namaAlternatif[j].value]) {
        hasilBandingkan[namaAlternatif[j].value] = { skor: 0, peringkat: 0 };
      }

      if (skorCopeland > 0) {
        hasilBandingkan[namaAlternatif[j].value].skor++; // Memperbarui skor untuk pemenang
        hasilBandingkan[namaAlternatif[i].value].skor--; // Memperbarui skor untuk yang kalah
      } else if (skorCopeland < 0) {
        hasilBandingkan[namaAlternatif[i].value].skor++; // Memperbarui skor untuk pemenang
        hasilBandingkan[namaAlternatif[j].value].skor--; // Memperbarui skor untuk yang kalah
      }

      hasilBandingkan[namaAlternatif[i].value].peringkat++;
      hasilBandingkan[namaAlternatif[j].value].peringkat++;
    }
  }

  return hasilBandingkan;
}




function tampilkanHasilBandingkan() {
  const tableBody3 = document.getElementById('tableBody3');
  tableBody3.innerHTML = '';

  const bordaMatrix1 = getBordaMatrix1();
  const namaAlternatif = document.querySelectorAll('.namaAlternatif');

  const hasilBandingkan = hitungHasilBandingkan(bordaMatrix1, namaAlternatif);

  // Menampilkan hasilBandingkan di tabel borda-matrix3
  const hasilArray = Object.entries(hasilBandingkan);

  // Urutkan hasilArray berdasarkan skor
  hasilArray.sort((a, b) => b[1].skor - a[1].skor);

  // Mengatur peringkat berdasarkan urutan skor
  let peringkat = 1;
  let prevSkor = null;

  for (const [alternatif, hasil] of hasilArray) {
    const row = document.createElement('tr');

    // Tambahkan nama alternatif di kolom pertama
    const cellNamaAlternatif = document.createElement('td');
    cellNamaAlternatif.textContent = alternatif;
    row.appendChild(cellNamaAlternatif);

    // Tambahkan skor dan peringkat di kolom-kolom berikutnya
    const cellSkor = document.createElement('td');
    cellSkor.textContent = hasil.skor;
    row.appendChild(cellSkor);

    if (prevSkor !== null && hasil.skor !== prevSkor) {
      peringkat++;
    }

    const cellPeringkat = document.createElement('td');
    cellPeringkat.textContent = peringkat;
    row.appendChild(cellPeringkat);

    prevSkor = hasil.skor;

    tableBody3.appendChild(row);
  }
}





function hitungSkorCopeland(alternatif1, alternatif2) {
  let skor = 0;

  for (let i = 0; i < alternatif1.length; i++) {
    if (alternatif1[i] > alternatif2[i]) {
      skor++;
    } else if (alternatif1[i] < alternatif2[i]) {
      skor--;
    }
  }

  return skor;
}