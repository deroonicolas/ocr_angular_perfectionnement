import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from '../../models/post.model';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrl: './post-list-item.component.scss',
})
export class PostListItemComponent implements OnInit {
  @Input() post!: Post;
  @Output() postCommented = new EventEmitter<{
    comment: string;
    postId: number;
  }>();

  ngOnInit(): void {}

  onNewComment(comment: string) {
    this.postCommented.emit({ comment, postId: this.post.id });
  }
}
