import React, { useState, useEffect } from 'react';
import { 
  toggleLike, 
  getPostLikes, 
  checkUserLike, 
  addComment, 
  getPostComments,
  updateComment,
  deleteComment 
} from '../api/auth';
import { Link } from 'react-router-dom';
import '../styles/PostInteractions.css';

const PostInteractions = ({ post, token, currentUserId }) => {
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [userLiked, setUserLiked] = useState(false);
  const [showLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  // Verificar si el usuario dio like al cargar
  useEffect(() => {
    const checkLike = async () => {
      try {
        const response = await checkUserLike(post.post_id, token);
        setUserLiked(response.hasLiked);
      } catch (error) {
        console.error('Error al verificar like:', error);
      }
    };
    checkLike();
  }, [post.post_id, token]);

  // Manejar like/unlike
  const handleLike = async () => {
    setLoading(true);
    try {
      const response = await toggleLike(post.post_id, token);
      setUserLiked(response.liked);
      setLikesCount(response.likesCount);
      
      // Si se quitó el like y la lista está abierta, actualizar
      if (!response.liked && showLikes) {
        const likesResponse = await getPostLikes(post.post_id, token);
        setLikes(likesResponse.likes);
      }
    } catch (error) {
      console.error('Error al manejar like:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar comentarios
  const loadComments = async () => {
    if (!showComments) {
      try {
        const response = await getPostComments(post.post_id, 1, 10, token);
        setComments(response.comments);
        setCommentsCount(response.count);
      } catch (error) {
        console.error('Error al cargar comentarios:', error);
      }
    }
    setShowComments(!showComments);
  };

  // Agregar comentario
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await addComment(post.post_id, newComment, token);
      setComments([...comments, response.comment]);
      setCommentsCount(response.commentsCount);
      setNewComment('');
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Editar comentario
  const handleEditComment = async (commentId, newContent) => {
    try {
      const response = await updateComment(commentId, newContent, token);
      setComments(comments.map(comment => 
        comment.id === commentId ? response.comment : comment
      ));
    } catch (error) {
      console.error('Error al editar comentario:', error);
    }
  };

  // Eliminar comentario
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId, token);
      setComments(comments.filter(comment => comment.id !== commentId));
      setCommentsCount(prev => prev - 1);
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="post-interactions">
      {/* Botones de interacción */}
      <div className="interaction-buttons">
        <button 
          className={`like-button ${userLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={loading}
        >
          {loading ? '...' : (userLiked ? '❤️' : '🤍')} 
          {likesCount > 0 && <span>{likesCount}</span>}
        </button>

        <button 
          className="comment-button"
          onClick={loadComments}
        >
          💬 {commentsCount > 0 && <span>{commentsCount}</span>}
        </button>
      </div>

      {/* Sección de likes */}
      {showLikes && (
        <div className="likes-section">
          <h4>Likes ({likesCount})</h4>
          {likes.length > 0 ? (
            <div className="likes-list">
              {likes.map(like => (
                <div key={like.id} className="like-item">
                  <img 
                    src={like.avatar_base64 || '/default-avatar.png'} 
                    alt={like.username}
                    className="like-avatar"
                  />
                  <Link 
                    to={`/user/${like.user_id}`}
                    className="like-username"
                    style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.target.style.textDecoration = 'none'}
                  >
                    {like.username}
                  </Link>
                  <span className="like-date">{formatDate(like.created_at)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay likes aún</p>
          )}
        </div>
      )}

      {/* Sección de comentarios */}
      {showComments && (
        <div className="comments-section">
          <h4>Comentarios ({commentsCount})</h4>
          
          {/* Formulario para nuevo comentario */}
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              maxLength={500}
              disabled={commentLoading}
            />
            <button type="submit" disabled={commentLoading || !newComment.trim()}>
              {commentLoading ? 'Enviando...' : 'Comentar'}
            </button>
          </form>

          {/* Lista de comentarios */}
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <img 
                      src={comment.avatar_base64 || '/default-avatar.png'} 
                      alt={comment.username}
                      className="comment-avatar"
                    />
                    <div className="comment-info">
                      <Link 
                        to={`/user/${comment.user_id}`}
                        className="comment-username"
                        style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                        onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.target.style.textDecoration = 'none'}
                      >
                        {comment.username}
                      </Link>
                      <span className="comment-date">{formatDate(comment.created_at)}</span>
                    </div>
                    {comment.user_id === currentUserId && (
                      <div className="comment-actions">
                        <button 
                          onClick={() => {
                            const newContent = prompt('Editar comentario:', comment.content);
                            if (newContent && newContent !== comment.content) {
                              handleEditComment(comment.id, newContent);
                            }
                          }}
                          className="edit-comment-btn"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('¿Eliminar este comentario?')) {
                              handleDeleteComment(comment.id);
                            }
                          }}
                          className="delete-comment-btn"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="comment-content">{comment.content}</div>
                </div>
              ))
            ) : (
              <p>No hay comentarios aún</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostInteractions; 