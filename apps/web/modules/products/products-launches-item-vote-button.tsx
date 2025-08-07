'use client'
import {BsCaretUp, BsCaretUpFill} from 'react-icons/bs';
import {cn} from "@repo/ui/lib/utils";
import {api} from '@repo/shared';
import {useState} from 'react';

export function ProductVoteButton(props: {
  productId: string;
  voteCount: number;
  isVoted: boolean;
}) {
  const {productId, isVoted: defaultIsVoted, voteCount: defaultVoteCount} = props;
  const [voteCount, setVoteCount] = useState<number>(defaultVoteCount);
  const [isVoted, setIsVoted] = useState<boolean>(defaultIsVoted);

  const onClickVote = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isVoted) {
      //当前状态为已投票，取消投票
      api.products.unvote(productId)
        .then(() => {
          setVoteCount(defaultIsVoted ? defaultVoteCount - 1 : defaultVoteCount);
          setIsVoted(false);
        })
        .catch((error) => {
          console.error('Error unvoting product:', error);
        });
    } else {
      //当前状态为未投票，进行投票
      api.products.vote(productId || '')
        .then(() => {
          setVoteCount(defaultIsVoted ? defaultVoteCount : defaultVoteCount + 1);
          setIsVoted(true);
        })
        .catch((error) => {
          console.error('Error voting product:', error);
        });
    }
  }
  return (
    <button
      id={'upvote-button'}
      className={cn('flex flex-col rounded-md justify-center items-center border border-gray-200 text-gray-500 w-12 h-12 cursor-pointer hover:border-red-400 transition-colors')}
      onClick={onClickVote}
    >
      {isVoted ?
        <BsCaretUpFill className="text-red-400"/>
        : <BsCaretUp className=""/>
      }
      {voteCount}
    </button>
  );
}
