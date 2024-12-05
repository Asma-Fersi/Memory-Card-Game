document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const startButton = document.getElementById('start');
    const hereButton = document.getElementById('here');
    const gameBoard = document.getElementById('gameBoard');
    const scoreDisplay = document.getElementById('score');  // Get the score element

    let images = [];
    let cards = [];
    let firstCard, secondCard;
    let locked = false;
    let score = 0;

    const predefinedImages = [
        'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR_8piLHH4Zh9prjS9Bs8VKJUUFi6LNnLb41lsEASkozJ-z7601' ,
        'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTfkSCrVMmntkRJK9_J69rSsRSrFX95kRb-SeS0IUxk115N0BCm' ,
        'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTsaxOgb-ThwEfPxyrniyen7A8H57bDytIecoL3TWFMhdFQBWwD',
        'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRavDfG06qYur-fc_RCOm6OnRfuDHIyAXI2SXTmNaXdd62_WyR1',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEmKEKAdzbGWWNdxPwnAE0eObIP08oJNTlQ3hSU1_PLRIgRTpO' ,
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZMmYWQIUyU1ok_c32a2bYYl3Rk7M-p5FHVqiazsztJ48GpLG5' ,
        'https://media.licdn.com/dms/image/v2/D4E22AQFVKsn5we1loA/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1712601088547?e=2147483647&v=beta&t=oKXgatJ8MZV-WVH1lraOlbplPGDZdzksbTlAjWir2IE' ,
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCqNLEUiKpcRX8c19o52eJWlz_nXGTEzv5zg&s',
        'https://i.pinimg.com/736x/08/af/17/08af176fb062281fc1e44a1635d62e13.jpg'
    ]
    


    fileInput.addEventListener('change', (event) => {
        const files = Array.from(event.target.files);
        images = files.map((file, index) => ({
            url: URL.createObjectURL(file),  // Create blob URL
            id: index  // Use the index as an identifier
        }));
    });

    hereButton.addEventListener('click', () => {
        images = predefinedImages.map((imagePath, index) => ({
            url: imagePath,  // Directly use the image path as URL
            id: index  // Use the index as an identifier
        })); 
    });   

    startButton.addEventListener('click', () => {
         
        if (images.length >= 2) {
            initializeGame();
        } else {
            alert("Please upload at least 2 images.");
        }
    });

    function initializeGame(){
        score = 0;
        scoreDisplay.textContent = score; 
        gameBoard.innerHTML='';
        locked = false;
        const pairedImages = images.concat(images);  // Duplicate each image
        shuffle(pairedImages);

        for (const image of pairedImages) {
            const card = document.createElement('div');
            card.classList.add('card');
        
            // Create front and back faces
            const frontFace = document.createElement('div');
            frontFace.classList.add('front');

            // Add an <img> element for the front face
            const img = document.createElement('img');
            img.src = image.url;  // Set the image source
            img.dataset.id = image.id;  // Add data-id for matching
            frontFace.appendChild(img); // Add the image inside the front face
        
            const backFace = document.createElement('div');
            backFace.classList.add('back');
        
            // Assemble the card
            card.appendChild(frontFace);
            card.appendChild(backFace);
            gameBoard.appendChild(card);
        }

        for (const card of gameBoard.children){
            card.addEventListener('click', () => flipCard(card));
        }

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1)); // Get a random index
                [array[i], array[j]] = [array[j], array[i]];  // Swap the elements
            }
        }
        function flipCard(card) {
            if (locked || card === firstCard) return;

            card.classList.toggle('flipped');

            if (!firstCard) {
                // First card flipped
                firstCard = card;
                return;
            }
            secondCard = card;
            locked = true;
            checkForMatch();
        }
        // Check if two flipped cards match
        function checkForMatch() {
            const firstImageID = firstCard.querySelector('.front img').dataset.id;
            const secondImageID = secondCard.querySelector('.front img').dataset.id;
        
            if (firstImageID === secondImageID) {
                // Match found
                console.log("match found");
                score++;
                scoreDisplay.textContent = score;  // Update the text content of the score display
                resetBoard();
                checkForWin();
            } else {
                // No match, unflip cards after a short delay
                locked = true;
                console.log('no match found');
                setTimeout(() => {
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                    resetBoard();
                }, 1000);  // 1-second delay
            }
            console.log(score);
        }
        
        // Reset board state for the next turn
        function resetBoard() {
            firstCard = null;
            secondCard = null;
            locked = false;  // Unlock the board
        }
        
    }
    function checkForWin() {
        const allCards = document.querySelectorAll('.card');
        const allFlipped = [...allCards].every(card => card.classList.contains('flipped'));
    
        if (allFlipped) {
            setTimeout(() => {
                alert('Congratulations! You won! 🎉');
            }, 500);
            initializeGame();
        }
    }  
});
