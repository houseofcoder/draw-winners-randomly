$(document).ready(function () {
    $('#sponsoredContest').change(function () {
        if ($(this).is(':checked')) {
            $('.sponsor-field').show();
        } else {
            $('.sponsor-field').hide();
        }
    });

    $('#generateButton').click(function () {
        try {
            let contestName = $('#contestName').val().trim();
            let names = $('#names').val().split(/[\n,]+/).map(name => name.trim()).filter(name => name !== "");
            let numWinners = parseInt($('#numWinners').val());
            let sponsored = $('#sponsoredContest').is(':checked');
            let sponsorName = $('#sponsorName').val().trim();

            if (!contestName || contestName.length > 200) {
                $('#contestName').addClass('is-invalid');
                return;
            } else {
                $('#contestName').removeClass('is-invalid');
            }

            if (names.length < numWinners || numWinners <= 0) {
                $('#names').addClass('is-invalid');
                $('#numWinners').addClass('is-invalid');
                return;
            } else {
                $('#names').removeClass('is-invalid');
                $('#numWinners').removeClass('is-invalid');
            }

            if (sponsored && !sponsorName) {
                $('#sponsorName').addClass('is-invalid');
                return;
            } else {
                $('#sponsorName').removeClass('is-invalid');
            }

            $('#winnerList').empty();
            $('#winnerModalLabel').text(contestName);
            $('#winnerModal').modal('show');

            const currentDate = new Date().toLocaleDateString();
            let contestDetailsHtml = `
            <div class="text-white"><span class="fw-bold">Number of Participants: </span> ${names.length}</div>
            `;
            if (sponsored) {
                contestDetailsHtml += `<div class="text-white"><span class="fw-bold">Sponsored by:  </span> ${sponsorName}</div>`;
            }
            $('#contestDetails').html(contestDetailsHtml);

            animateParticipants(names, numWinners);
        } catch (error) {
            console.error("An error occurred: ", error);
            alert("An unexpected error occurred. Please try again.");
        }
    });


    function animateParticipants(names, numWinners) {
        let animationDuration = 3000;
        let intervalTime = 100;
        let remainingNames = [...names];
        let displayInterval;

        displayInterval = setInterval(() => {
            let randomIndex = Math.floor(Math.random() * remainingNames.length);
            let randomName = remainingNames[randomIndex];
            $('#winnerList').html(`<li class='list-group-item text-info bg-dark'>${randomName}</li>`);
        }, intervalTime);

        setTimeout(() => {
            clearInterval(displayInterval);
            generateWinners(remainingNames, numWinners);
        }, animationDuration);
    }

    function generateWinners(names, numWinners) {
        let winners = [];
        let remainingNames = [...names];
        let displayInterval;

        let displayWinners = () => {
            if (winners.length === numWinners) {
                clearInterval(displayInterval);
                showWinnersModal(winners);
                return;
            }

            let randomIndex = Math.floor(Math.random() * remainingNames.length);
            let randomName = remainingNames[randomIndex];
            remainingNames.splice(randomIndex, 1);

            winners.push(randomName);
        };

        displayInterval = setInterval(displayWinners, 100);
        setTimeout(() => clearInterval(displayInterval), 5000);
    }

    function showWinnersModal(winners) {
        $('#winnerList').empty();
        winners.forEach((winner, index) => {
            $('#winnerList').append(`<li class='list-group-item d-flex justify-content-between align-items-start fw-bolder'>${index + 1}. ${winner}</li>`);
        });
    }
});
