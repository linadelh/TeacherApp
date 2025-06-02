document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Erreur lors de la récupération");
    const data = await res.json();
    const { prenom, nom } = data.user;
    document.getElementById("doctor-name").textContent = `Dr. ${prenom} ${nom}`;
  } catch (err) {
    console.error("Erreur:", err);
  }
});

let currentVoeuId = null;
let selectedTeacherId = null;
const token = localStorage.getItem("token");
async function loadMessages() {
  const res = await fetch("/messages", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const messages = await res.json();
  const messagesDiv = document.querySelector(".module-selection");
  const filteredMessages = messages.filter(
    (msg) =>
      msg.receiver_id === selectedTeacherId ||
      msg.sender_id === selectedTeacherId,
  );
  filteredMessages.reverse();
  messagesDiv.innerHTML = "";
  if (filteredMessages.length === 0) {
        const noMsg = document.createElement("p");
        noMsg.textContent = "Aucune conversation disponible pour le moment.";
        noMsg.style.fontStyle = "italic";
        noMsg.style.color = "#888";
        messagesDiv.appendChild(noMsg);
    } else {
    
        filteredMessages.forEach((msg) => {
        const p = document.createElement("p");
        p.textContent = msg.content;

        // Ici on regarde qui a envoyé le message
        if (msg.sender_id === selectedTeacherId) {
            // Message de teacher => classe "message-left"
            p.classList.add("message-left");
        } else {
            // Message de chef => classe "message-right"
            p.classList.add("message-right");
        }

        messagesDiv.appendChild(p);
        });
    }
}

document.querySelector(".btn-send").addEventListener("click", async (e) => {
  e.preventDefault();
  const input = document.getElementById("negotiation-message");
  if (!selectedTeacherId) {
    alert("Aucun enseignant sélectionné.");
    return;
  }

  await fetch("/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content: input.value,
      receiver_id: selectedTeacherId,
      sender_id: 1, // chef de département
    }),
  });

// 2. Mettre à jour le statut du vœu en "en négociation"
  await fetch(`/api/voeux/set-negotiation/${currentVoeuId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const rows = document.querySelectorAll(".voeux-table tbody tr");
  rows.forEach((row) => {
  const acceptButton = row.querySelector(".btn-accept");
  if (acceptButton && acceptButton.dataset.id === currentVoeuId.toString()) {
    const statusCell = row.querySelector(".status");
    statusCell.textContent = "en négociation";
    statusCell.className = "status status-en-négociation";
    // Optionnel : désactiver les boutons d'action si besoin
    // row.querySelector("td:last-child").innerHTML = "<span>Action terminée</span>";
  }
});

  input.value = "";
  loadMessages(); // Refresh messages
  loadStats();    // Met à jour les stats
});

async function openNegotiateModal(voeuId, teacherId) {
  currentVoeuId = voeuId;
  selectedTeacherId = teacherId;
  try { 
    //tch teacher's request details
    const response = await fetch(`/api/voeux/teacher-wishes/${voeuId}`);
    if (!response.ok) throw new Error("Erreur réseau");
    const result = await response.json();
    // Check if the request was successful
    if (!result.success) {
      throw new Error(result.error || "Échec de la récupération des détails");
    }
    const requestDetails = result.data; // Access the data property
    document.getElementById("teacher-name").textContent =
      `${requestDetails.prenom} ${requestDetails.nom} (${requestDetails.grade} - ${requestDetails.departement})`;
    // 3. Update status
    const statusElement = document.getElementById("current-status");
    statusElement.textContent = requestDetails.status;
    statusElement.className = `status status-${requestDetails.status.toLowerCase().replace(" ", "-")}`;

    // 5. Show the modal
    document.getElementById("negotiateModal").style.display = "block";
    loadMessages();
    loadStats();
  } catch (error) {
    console.error("Erreur:", error);
    alert(`Impossible de charger les détails de la requête: ${error.message}`);
  }
}

// Close modal function
function closeModal() {
  document.getElementById("negotiateModal").style.display = "none";
}


// Gestion des filtres
document.addEventListener("DOMContentLoaded", function () {
  // Appliquer les filtres
  document
    .querySelector(".filter-apply")
    .addEventListener("click", function () {
      applyFilters();
    });

  // Réinitialiser les filtres
  document
    .querySelector(".filter-reset")
    .addEventListener("click", function () {
      document.getElementById("filter-status").value = "";
      document.getElementById("filter-grade").value = "";
      document.getElementById("filter-department").value = "";
      applyFilters();
    });

  // Fermer la modal si on clique en dehors
  window.addEventListener("click", function (event) {
    const modal = document.getElementById("negotiateModal");
    if (event.target === modal) {
      closeModal();
    }
  });
});

function applyFilters() {
  const statusFilter = document
    .getElementById("filter-status")
    .value.toLowerCase();
  const gradeFilter = document
    .getElementById("filter-grade")
    .value.toLowerCase();
  const departmentFilter = document
    .getElementById("filter-department")
    .value.toLowerCase();

  const rows = document.querySelectorAll(".voeux-table tbody tr");

  rows.forEach((row) => {
    const status = row.querySelector(".status").textContent.toLowerCase();
    const grade = row.cells[1].textContent.toLowerCase();
    const department = row.cells[2].textContent.toLowerCase();

    const statusMatch = !statusFilter || status.includes(statusFilter);
    const gradeMatch = !gradeFilter || grade === gradeFilter;
    const departmentMatch =
      !departmentFilter || department === departmentFilter;

    if (statusMatch && gradeMatch && departmentMatch) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}


function updateStats(action) {
  // Simuler la mise à jour des statistiques
  const cards = document.querySelectorAll(".card-value");

  if (action === "accept") {
    // Vœux acceptés
    const accepted = parseInt(cards[1].textContent) + 1;
    cards[1].textContent = accepted;

    // En attente
    const pending = parseInt(cards[3].textContent) - 1;
    cards[3].textContent = pending;
  }

  if (action === "negotiate") {
    // En négociation
    const negotiating = parseInt(cards[2].textContent) + 1;
    cards[2].textContent = negotiating;

    // En attente
    const pending = parseInt(cards[3].textContent) - 1;
    cards[3].textContent = pending;
  }
}

// Gestion de la pagination
document.addEventListener("DOMContentLoaded", function () {
  const paginationButtons = document.querySelectorAll(".pagination button");

  paginationButtons.forEach((button) => {
    button.addEventListener("click", function () {
      paginationButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Ici, vous pourriez charger les données de la page sélectionnée
      console.log(`Chargement de la page ${this.textContent}`);
    });
  });
});

// Gestion de l'export
document.querySelector(".btn-export").addEventListener("click", function () {
  alert("Export des données en cours...");
  // Ici, vous pourriez ajouter la logique pour exporter les données
});

async function loadStats() {
  try {
    //document.querySelector('.card-1 .card-value').textContent = "555";
    const response = await fetch("/api/voeux/simple-stats");
    const stats = await response.json();

    // Update the numbers on the page
    document.querySelector(".card-1 .card-value").textContent = stats.total;
    document.querySelector(".card-2 .card-value").textContent = stats.accepted;
    document.querySelector(".card-3 .card-value").textContent =
      stats.negotiating;
    document.querySelectorAll(".card-1 .card-value")[1].textContent =
      stats.pending;
  } catch (err) {
    console.error("Failed to load stats", err);
  }
}

// Load stats when page opens
loadStats();

function exportToExcel() {
  // Get the table element
  const table = document.querySelector(".voeux-table table");

  // Clone the table to modify it for export
  const tableClone = table.cloneNode(true);

  // Remove action buttons from the clone (not needed in Excel)
  const actionCells = tableClone.querySelectorAll("td:last-child");
  actionCells.forEach((cell) => cell.remove());

  // Create a worksheet from the table
  const ws = XLSX.utils.table_to_sheet(tableClone);

  // Set column widths (optional)
  ws["!cols"] = [
    { wch: 20 }, // Enseignant
    { wch: 10 }, // Grade
    { wch: 10 }, // Département
    { wch: 30 }, // Modules demandés
    { wch: 10 }, // PFE Licence
    { wch: 10 }, // PFE Master
    { wch: 10 }, // Heures Sup
    { wch: 30 }, // Commentaire
    { wch: 15 }, // Statut
  ];

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Vœux");

  // Generate file name with current date
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0];
  const fileName = `Voeux_Enseignants_${dateStr}.xlsx`;

  // Export the workbook
  XLSX.writeFile(wb, fileName);
}
function exportToPDF() {
  const table = document.querySelector(".table-container"); // ou une autre classe si différente

  html2canvas(table).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF("l", "mm", "a4"); // paysage
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save("voeux_tableau.pdf");
  });
}

// Function to handle accepting a voeu
async function acceptVoeu(voeuId) {
  // Confirm with user
  if (!confirm("Êtes-vous sûr de vouloir accepter ce vœu ?")) {
    return;
  }

  try {
    // 1. Send request to server
    const response = await fetch(`/api/voeux/accept/${voeuId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 2. Check response
    if (!response.ok) {
      throw new Error("Erreur réseau");
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Échec de l'acceptation");
    }

    // 3. Update UI on success
    updateVoeuStatus(voeuId, "Accepté");
    updateStatsAfterAccept();

    alert("Vœu accepté avec succès !");
  } catch (error) {
    console.error("Erreur:", error);
    alert(`Erreur lors de l'acceptation: ${error.message}`);
  }
}
// Update the status in the table row
function updateVoeuStatus(voeuId, newStatus) {
  // Find all rows
  const rows = document.querySelectorAll(".voeux-table tbody tr");

  rows.forEach((row) => {
    // Find the row with matching voeu_id
    const acceptButton = row.querySelector(".btn-accept");
    if (acceptButton && acceptButton.dataset.id === voeuId.toString()) {
      // 1. Update status cell
      const statusCell = row.querySelector(".status");
      statusCell.textContent = newStatus;
      statusCell.className = `status status-${newStatus.toLowerCase().replace(" ", "-")}`;

      // 2. Remove action buttons
      const actionCell = row.querySelector("td:last-child");
      actionCell.innerHTML = "<span>Action terminée</span>";
    }
  });
}

// Update statistics cards
function updateStatsAfterAccept() {
  // Update accepted count
  const acceptedCard = document.querySelector(".card-2 .card-value");
  if (acceptedCard) {
    acceptedCard.textContent = parseInt(acceptedCard.textContent) + 1;
  }

  // Update pending count (assuming it's the 4th card)
  const pendingCard = document.querySelector(".card-4 .card-value");
  if (pendingCard) {
    pendingCard.textContent = parseInt(pendingCard.textContent) - 1;
  }

  // Optional: Reload all stats to ensure consistency
  loadStats();
}
