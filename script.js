class ParkingSystem {
    constructor(totalSpots) {
        this.totalSpots = totalSpots;
        this.spots = new Array(totalSpots).fill(null); // Holds vehicle number or null
        this.reservedSpots = new Set(); // Set of reserved spot numbers
        this.history = [];
        this.initializeUI();
        this.updateStats();
    }

    initializeUI() {
        const parkingLot = document.getElementById('parkingLot');
        parkingLot.innerHTML = '';
        
        for (let i = 0; i < this.totalSpots; i++) {
            const spot = document.createElement('div');
            spot.className = 'parking-spot';
            spot.textContent = i + 1;
            spot.onclick = () => this.handleSpotClick(i + 1);
            parkingLot.appendChild(spot);
        }
    }

    updateStats() {
        const occupied = this.spots.filter(spot => spot !== null).length;
        const reserved = this.reservedSpots.size;
        document.getElementById('totalSpots').textContent = this.totalSpots;
        document.getElementById('availableSpots').textContent = this.totalSpots - occupied - reserved;
        document.getElementById('occupiedSpots').textContent = occupied;
    }

    handleSpotClick(spotNumber) {
        document.getElementById('spotNumber').value = spotNumber;
    }

    parkVehicle(vehicleNumber, spotNumber) {
        if (!vehicleNumber || !spotNumber) {
            alert('Please enter both vehicle number and spot number');
            return false;
        }

        if (spotNumber < 1 || spotNumber > this.totalSpots) {
            alert('Invalid spot number');
            return false;
        }

        if (this.spots[spotNumber - 1] !== null) {
            alert('Spot already occupied');
            return false;
        }

        if (this.reservedSpots.has(spotNumber)) {
            alert('Spot is reserved');
            return false;
        }

        this.spots[spotNumber - 1] = vehicleNumber;
        document.querySelectorAll('.parking-spot')[spotNumber - 1].classList.add('occupied');
        
        const timestamp = new Date().toLocaleString();
        this.history.unshift({
            type: 'parked',
            vehicleNumber,
            spotNumber,
            timestamp
        });

        this.updateStats();
        this.updateHistory();
        this.showPaymentDialog(vehicleNumber, spotNumber); // Show payment after parking
        return true;
    }

    removeVehicle(spotNumber) {
        if (!spotNumber) {
            alert('Please enter spot number');
            return false;
        }

        if (this.spots[spotNumber - 1] === null) {
            alert('Spot is already empty');
            return false;
        }

        const vehicleNumber = this.spots[spotNumber - 1];
        this.spots[spotNumber - 1] = null;
        document.querySelectorAll('.parking-spot')[spotNumber - 1].classList.remove('occupied');

        const timestamp = new Date().toLocaleString();
        this.history.unshift({
            type: 'removed',
            vehicleNumber,
            spotNumber,
            timestamp
        });

        this.updateStats();
        this.updateHistory();
        return true;
    }

    updateHistory() {
        const historyLog = document.getElementById('historyLog');
        historyLog.innerHTML = this.history.map(entry => `
            <div class="history-entry">
                ${entry.timestamp}: Vehicle ${entry.vehicleNumber} ${entry.type} at spot ${entry.spotNumber}
            </div>
        `).join('');
    }

    reserveSpot(spotNumber) {
        if (this.spots[spotNumber - 1] !== null) {
            alert('Spot is already occupied');
            return false;
        }
        
        this.reservedSpots.add(spotNumber);
        document.querySelectorAll('.parking-spot')[spotNumber - 1].classList.add('reserved');
        this.updateStats();
        return true;
    }

    showPaymentDialog(vehicleNumber, spotNumber) {
        const price = (Math.random() * 20 + 5).toFixed(2); // Random price between 5 and 25
        const paymentSection = document.createElement('div');
        paymentSection.className = 'payment-section';
        paymentSection.innerHTML = `
            <h2>Payment for Vehicle ${vehicleNumber}</h2>
            <p>Spot Number: ${spotNumber}</p>
            <p class="price">$${price}</p>
            <button onclick="paymentSystem.processPayment('${vehicleNumber}', ${spotNumber}, ${price})">Pay</button>
        `;
        document.body.appendChild(paymentSection);
    }
}

const parkingSystem = new ParkingSystem(15);

// Function to handle parking
function parkVehicle() {
    const vehicleNumber = document.getElementById('vehicleNumber').value;
    const spotNumber = parseInt(document.getElementById('spotNumber').value);
    if (parkingSystem.parkVehicle(vehicleNumber, spotNumber)) {
        document.getElementById('vehicleNumber').value = '';
        document.getElementById('spotNumber').value = '';
    }
}

// Function to handle removal
function removeVehicle() {
    const spotNumber = parseInt(document.getElementById('spotNumber').value);
    if (parkingSystem.removeVehicle(spotNumber)) {
        document.getElementById('spotNumber').value = '';
    }
}

// Function to reserve a spot
function reserveSpot() {
    const spotNumber = parseInt(document.getElementById('spotNumber').value);
    if (parkingSystem.reserveSpot(spotNumber)) {
        document.getElementById('spotNumber').value = '';
    }
}

// Mock Payment System
const paymentSystem = {
    processPayment(vehicleNumber, spotNumber, price) {
        alert(`Payment of $${price} processed for Vehicle ${vehicleNumber} at Spot ${spotNumber}`);
        // Remove payment dialog after processing
        const paymentSection = document.querySelector('.payment-section');
        paymentSection && paymentSection.remove();
    }
};
