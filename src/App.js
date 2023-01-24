import './Styles/App.css';
import './Styles/Comment.css'
import { useState } from 'react';
import { useEffect } from 'react';
import JsonData from './data.json';
import ReplyIcon from './images/icon-reply.svg';
import DeleteIcon from './images/icon-delete.svg';
import EditIcon from './images/icon-edit.svg';
import UserImage from './images/avatars/image-juliusomo.png';

function App() {
  // an array of components describing comments & replies respectivily
  const [view, setView] = useState([]);
  // contains users text while adding new comment
  const [writeComment, setWriteComment] = useState('');
  // Delete comment/reply array position
  const [deletePosition, setdeletePosition] = useState();
  // Delete model style
  const [modelStyle, setModelStyle] = useState('model-view-close');

  // intitailizes View array with existing comments-
  // & replies from imported json file
  useEffect(() => {
    setView(old => setUp());
  }, [])


  function setUp() {
    for (let i = 0; i < JsonData.comments.length; i++) {
      //If the comment is made by the current user
      // add the comment using this component.
      if (String(JsonData.comments[i].user.username) ===
        String(JsonData.currentUser.username)) {
        setView(old => [...old,
        <UserComment
          key={`User Comment ${i}`}
          idnum={i}
          repliedto={''}
          image={JsonData.comments[i].user.image.png}
          name={JsonData.comments[i].user.username}
          score={JsonData.comments[i].score}
          date={JsonData.comments[i].createdAt}
          content={JsonData.comments[i].content}
          theUser={JsonData.currentUser.username} />
        ])
      } else { // else add the comment with this component.
        setView(old => [...old,
        <Othercomment
          key={`Other's Comment ${i}`}
          idnum={i}
          repliedto={''}
          image={JsonData.comments[i].user.image.png}
          name={JsonData.comments[i].user.username}
          score={JsonData.comments[i].score}
          date={JsonData.comments[i].createdAt}
          content={JsonData.comments[i].content}
          theUser={JsonData.currentUser.username} />
        ])
      }

      // If comments have replies, Add them comment array
      if (JsonData.comments[i].replies.length > 0) {
        for (let k = 0; k < JsonData.comments[i].replies.length; k++) {
          // if the reply is made by the user add it with this component
          if (String(JsonData.comments[i].replies[k].user.username)
            === String(JsonData.currentUser.username)) {
            setView(old => [...old,
            <div className='replied'
              idnum={i + 1}
              key={`User Comment Reply ${i}`}>
              <UserComment
                idnum={i + 1}
                repliedto={`@${JsonData.comments[i].replies[0].user.username}`}
                image={JsonData.comments[i].replies[k].user.image.png}
                name={JsonData.comments[i].replies[k].user.username}
                score={JsonData.comments[i].replies[k].score}
                date={JsonData.comments[i].replies[k].createdAt}
                content={JsonData.comments[i].replies[k].content}
                theUser={JsonData.currentUser.username} />
            </div>
            ])
          } else { // else add it with this component
            setView(old => [...old,
            <div className='replied'
              idnum={i + 1}
              key={`Other's Comment Reply ${i}`}>
              <Othercomment
                idnum={i + 1}
                repliedto={`@${JsonData.comments[i].user.username}`}
                image={JsonData.comments[i].replies[k].user.image.png}
                name={JsonData.comments[i].replies[k].user.username}
                score={JsonData.comments[i].replies[k].score}
                date={JsonData.comments[i].replies[k].createdAt}
                content={JsonData.comments[i].replies[k].content}
                theUser={JsonData.comments[i].user.username} />
            </div>
            ])
          }
        }
      }
    }
    return view;
  }


  // New Comment TextArea Input
  function handleInput(event) {
    setWriteComment(event.target.value);
  }

  // Add new comment to array
  function addComment() {
    if (writeComment !== '') {
      setView(old => [...old,
      <UserComment
        key={(`New User Comment ${old.length + 1}`)}
        idnum={old.length + 1}
        image={JsonData.currentUser.image.png}
        name={JsonData.currentUser.username}
        score={0}
        date={'today'}
        content={writeComment}
        theUser={JsonData.currentUser.username} />
      ]);
    }
    setWriteComment(old => '');
    document.getElementById('commentTextarea').value = '';
  }

  //Add new reply to array
  function handleReplySend(replyText, position, repliedto) {
    setView(old => {
      // finding the correct index to splice in the new reply
      let index = 0;
      for (let i = 0; i < old.length; i++) {
        if (old[i].props.idnum === position)
          index = (old.indexOf(old[i]));
      }
      // splicing in the new reply
      let newArr = old.slice();
      newArr.splice((index + 1), 0,
        <div className='replied'
          key={(`New User Reply${old.length + 1}`)}
          idnum={(old.length + 1)}>
          <UserComment
            idnum={(old.length + 1)}
            repliedto={'@' + repliedto}
            image={JsonData.currentUser.image.png}
            name={JsonData.currentUser.username}
            score={0}
            date={'today'}
            content={replyText}
            theUser={JsonData.currentUser.username}
          />
        </div>)
      return [...newArr];
    });
  }


  function handleDeletion(position) {
    setView(old => {
      // finding the correct index to delete
      let index = 0;
      for (let i = 0; i < old.length; i++) {
        if (old[i].props.idnum === position)
          index = old.indexOf(old[i])
      }
      //deleting the comment
      let newArr = old.slice();
      newArr.splice((index), 1);
      return [...newArr];
    });
  }

  function handleDeletePrep(num) {
    if (modelStyle === 'model-view-close') {
      setModelStyle(old => { return 'model-view' });
      document.getElementsByTagName('html')[0].style.overflowY = 'hidden';
    } else {
      setModelStyle(old => { return 'model-view-close' });
      document.getElementsByTagName('html')[0].style.overflowY = 'auto';
    }
    setdeletePosition(old => num);
  }




  //Other user's Comments and replies Component
  function Othercomment(props) {
    const [username] = useState(props.name);
    const [likes, setLikes] = useState(props.score);
    const [createdAt] = useState(props.date);
    const [message] = useState(props.content);
    const [rFormStyle, setRFormStyle] = useState('reply-form-close');
    const [likeStyle, setLikeStyle] = useState('like');
    const [dislikeStyle, setDislikeStyle] = useState('dislike');
    // contains users text while adding a reply
    const [writeReply, setWriteReply] = useState('');


    // New Reply TextArea Input
    function handleReplyInput(event) {
      setWriteReply(event.target.value);
    }

    function handleLike(rating) {
      if (rating === '+1' && likes < props.score + 1) {
        setLikeStyle(old => { return 'liked' });
        setDislikeStyle(old => { return 'dislike' });
        setLikes(old => {
          return props.score + 1
        })
      } else if (rating === '-1' && likes !== props.score - 1) {
        setDislikeStyle(old => { return 'disliked' });
        setLikeStyle(old => { return 'like' });
        setLikes(old => {
          return props.score - 1
        })
      } else {
        setLikes(old => {
          return props.score;
        })
        if (rating === '+1' && likes === props.score + 1) {
          setLikeStyle(old => { return 'like' });
        } else {
          setDislikeStyle(old => { return 'dislike' });
        }
      }
    }

    function handleReplyBtn() {
      if (rFormStyle === 'reply-form-close') {
        setRFormStyle(old => { return 'reply-form' });
      } else {
        setRFormStyle(old => { return 'reply-form-close' });
      }
    }

    function handleReplySendBtn() {
      let replyTextareas = document.getElementsByClassName('replyTextarea');
      if (writeReply !== '') {
        handleReplyBtn();
        handleReplySend(writeReply, props.idnum, props.name);
      }
      setWriteReply(old => '');
      for (let i = 0; i < replyTextareas.length; i++) {
        document.getElementsByClassName('replyTextarea')[i].value = '';
      }
    }


    return (
      <div className='wrapper'>
        <div className='comment'>
          {/* Like button */}
          <div className='like-btn'>
            <div>
              <button className={likeStyle}
                onClick={() => { handleLike("+1") }}>
                <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="currentColor" /></svg>
              </button>
              <p>{likes}</p>
              <button className={dislikeStyle}
                onClick={() => { handleLike("-1") }}>
                <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="currentColor" /></svg>
              </button>
            </div>

            {/* Reply button mobile */}
            <button className='reply-btn reply-btn-mobile'
              onClick={handleReplyBtn}>
              <img src={ReplyIcon} alt='' /> Reply
            </button>

          </div>
          {/* User and Date */}
          <div className='body'>
            <div className='header'>
              <div>
                <img src={require(`./images/avatars/image-${username}.png`)} alt='' />
                <p>{username}</p>
                <p>{createdAt}</p>
              </div>
              {/* Reply button */}
              <button className='reply-btn'
                onClick={handleReplyBtn}>
                <img src={ReplyIcon} alt='' /> Reply
              </button>
            </div>
            {/* The actual Comment or Reply */}
            <div className='content'>
              <p><em>{props.repliedto}</em>{" " + message}</p>
            </div>
          </div>
        </div>

        {/* Reply Prompt dropdown */}
        <div className={rFormStyle}>
          <img className='form1' src={require(`./images/avatars/image-juliusomo.png`)} alt='' />
          <textarea className='replyTextarea' placeholder='Add a reply...'
            onChange={handleReplyInput}>
          </textarea>
          <button className='form1'
            onClick={handleReplySendBtn}>REPLY</button>
          {/* Mobile swap outs */}
          <div className='reply-form-mobile'>
            <img src={require(`./images/avatars/image-${props.theUser}.png`)} alt='' />
            <button onClick={handleReplySendBtn} >REPLY</button>
          </div>
        </div>
      </div>
    )
  }



  // The current User's Comments and replies Component
  function UserComment(props) {
    const [username] = useState(props.name);
    const [likes, setLikes] = useState(props.score);
    const [createdAt] = useState(props.date);
    const [message, setMessage] = useState(props.content);
    const [updateBtnStyle, setUpdateBtnStyle] = useState('update-btn-close');
    const [contentStyle, setContentStyle] = useState('content');
    const [textareaStyle, setTextareaStyle] = useState('mycomment-textarea-close');
    const [writeUpdate, setWriteUpdate] = useState(message);
    // like displike button 
    const [likeStyle, setLikeStyle] = useState('like');
    const [dislikeStyle, setDislikeStyle] = useState('dislike');

    function handleLike(rating) {
      if (rating === '+1' && likes < props.score + 1) {
        setLikeStyle(old => { return 'liked' });
        setDislikeStyle(old => { return 'dislike' });
        setLikes(old => {
          return props.score + 1
        })
      } else if (rating === '-1' && likes !== props.score - 1) {
        setDislikeStyle(old => { return 'disliked' });
        setLikeStyle(old => { return 'like' });
        setLikes(old => {
          return props.score - 1
        })
      } else {
        setLikes(old => {
          return props.score;
        })
        if (rating === '+1' && likes === props.score + 1) {
          setLikeStyle(old => { return 'like' });
        } else {
          setDislikeStyle(old => { return 'dislike' });
        }
      }
    }

    // update reply TextArea Input
    function handleInputUpdate(event) {
      setWriteUpdate(event.target.value)
    }

    function handleUpdate() {
      handleEdit();
      setMessage(writeUpdate);
    }

    function handleEdit() {
      if (updateBtnStyle === 'update-btn-close') {
        setUpdateBtnStyle(old => { return 'update-btn' });
        setContentStyle(old => { return 'content-close' });
        setTextareaStyle(old => { return 'mycomment-textarea' });
      } else {
        setUpdateBtnStyle(old => { return 'update-btn-close' });
        setContentStyle(old => { return 'content' });
        setTextareaStyle(old => { return 'mycomment-textarea-close' });
      }
    }


    return (
      <div className='wrapper'>
        <div className='comment'>
          {/* Like button */}
          <div className='like-btn'>
            <div>
              <button className={likeStyle}
                onClick={() => { handleLike('+1') }}>
                <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="currentColor" /></svg>
              </button>
              <p>{likes}</p>
              <button className={dislikeStyle}
                onClick={() => { handleLike('-1') }}>
                <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="currentColor" /></svg>
              </button>
            </div>

            <div className='header-btn header-btn-mobile'>
              {/* Delete button */}
              <button className='delete-btn'
                onClick={() => { handleDeletePrep(props.idnum) }}>
                <img src={DeleteIcon} alt='' /> Delete
              </button>
              {/* Edit button */}
              <button className='edit-btn'
                onClick={() => { handleEdit() }}>
                <img src={EditIcon} alt='' /> Edit
              </button>
            </div>
          </div>

          {/* User and Date */}
          <div className='body'>
            <div className='header'>
              <div>
                <img src={require(`./images/avatars/image-${username}.png`)} alt='' />
                <p>{username}</p>
                <p className='you-title'>you</p>
                <p>{createdAt}</p>
              </div>

              <div className='header-btn'>
                {/* Delete button */}
                <button className='delete-btn'
                  onClick={() => { handleDeletePrep(props.idnum) }}>
                  <img src={DeleteIcon} alt='' /> Delete
                </button>
                {/* Edit button */}
                <button className='edit-btn'
                  onClick={() => { handleEdit() }}>
                  <img src={EditIcon} alt='' /> Edit
                </button>
              </div>
            </div>
            {/* The actual Comment or Reply */}
            <div className={contentStyle}>
              <p><em>{props.repliedto}</em>{" " + message}</p>
            </div>

            <div className='edit-options'>
              {/* on edit button textarea */}
              <textarea className={textareaStyle}
                defaultValue={message}
                onChange={handleInputUpdate}>

              </textarea>
              {/* Update Button */}
              <button className={updateBtnStyle}
                onClick={handleUpdate}>
                UPDATE
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }




  return (
    <div id='page-wrapper'>

      {/* Delete Model */}
      <div id={modelStyle}>
        <div id='model'>
          <p>Delete comment</p>
          <p>Are you sure you want to delete this comment?
            This will remove the comment and can't be undone.
          </p>
          <div>
            <button onClick={() => { handleDeletePrep() }}>No, Cancel</button>
            <button onClick={() => {
              handleDeletePrep();
              handleDeletion(deletePosition);
            }}>
              Yes, Delete
            </button>
          </div>
        </div>
      </div>

      <div id='comments-wrapper'>
        {view}
        {/* Write a New Comment */}
        <div className='new-comment'>
          <img className='form1' src={UserImage} alt='' />
          <textarea id='commentTextarea' placeholder='Add a comment...'
            onChange={handleInput}>
          </textarea>
          <button className='form1'
            onClick={addComment}>SEND</button>
          {/* Mobile Swap-out for reply form */}
          <div className='reply-form-mobile'>
            <img src={UserImage} alt='' />
            <button onClick={addComment}>SEND</button>
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
