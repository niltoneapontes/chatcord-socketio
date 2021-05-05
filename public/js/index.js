
$('button.avatar-option-image').click(function(event) {
  const selectedAvatar = event.currentTarget.id;
  selectAvatar(selectedAvatar);

  const selected = document.querySelector('.selected');
  if(selected) {
    selected.classList.remove('selected');
  }
  (this).classList.add('selected');
})

function selectAvatar(id) {
  const selectedOption = `#avatar .avatar-option[value=${id}]`;
  $(selectedOption).attr('selected','selected');
}