module ATicTacToe where 

import Data.Char
import Data.List
import System.IO
import System.Random hiding (next)

-- Ordering is O<B<X done automatically at data declaration 
data Player = O | B | X 
              deriving (Eq, Ord, Show)
              
type Grid = [[Player]]

size :: Int
size = 3

next :: Player -> Player 
next O = X
next B = B
next X = O 

empty :: Grid 
empty = replicate size (replicate size B)

full :: Grid -> Bool
full = all (/= B) . concat 

turn :: Grid -> Player 
turn g = if os <= xs then O else X
  where 
    os = length (filter (==O) ps)
    xs = length (filter (==X) ps)
    ps = concat g    
    
wins :: Player -> Grid -> Bool
wins p g = any line (rows ++ cols ++ dias)
           where
              line = all (== p)
              rows = g
              cols = transpose g
              dias = [diag g, diag (map reverse g)]

-- this index twice into grid 0,0 1,1 2,2 the other is done by reversing g     
diag :: Grid -> [Player]
diag g = [g !! n !! n | n <- [0..size-1]]

won :: Grid -> Bool 
won g = wins O g || wins X g 
  
putGrid :: Grid -> IO ()
putGrid =
   putStrLn . unlines . concat . interleave bar . map showRow
   where bar = [replicate ((size*4)-1) '-']
   
            
showRow :: [Player] -> [String]
showRow = beside . interleave bar . map showPlayer
          where
             beside = foldr1 (zipWith (++))
             bar    = replicate 3 "|"

showPlayer :: Player -> [String]
showPlayer O = ["   ", " O ", "   "]
showPlayer B = ["   ", "   ", "   "]
showPlayer X = ["   ", " X ", "   "]

interleave :: a -> [a] -> [a]
interleave x []     = []
interleave x [y]    = [y]
interleave x (y:ys) = y : x : interleave x ys

{-
  a grid is indexed in the following manner
  
  0 | 1 | 2
  ----------
  3 | 4 | 5
  ----------
  6 | 7 | 8
  
  a move is valid if the index is within the range and currently blank
-}
valid :: Grid -> Int -> Bool
valid g i = 0 <= i && i < size^2 && concat g !! i == B 
 
move:: Grid -> Int -> Player -> [Grid]
move g i p =
   if valid g i then [chop size (xs ++ [p] ++ ys)] else []
   where (xs,y:ys) = splitAt i (concat g)
 
chop :: Int -> [a] -> [[a]]
chop n [] = []
chop n xs = take n xs : chop n (drop n xs)

getNat :: String -> IO Int
getNat prompt = do putStr prompt
                   xs <- getLine
                   if xs /= [] && all isDigit xs then
                      return (read xs)
                   else 
                      do putStrLn "ERROR: Invalid number!"
                         getNat prompt
                         
prompt :: Player -> String 
prompt p = "Player "++ show p ++ ", enter your move: "

cls :: IO ()
cls = putStr "\ESC[2J"

goto :: (Int,Int) -> IO ()
goto (x,y) = putStr ("\ESC[" ++ show y ++ ";" ++ show x ++ "H")

tictactoe :: IO()
tictactoe = run empty O 

run :: Grid -> Player -> IO()
run g p = do cls
             goto (1,1)
             putGrid g
             run' g p 

run' :: Grid -> Player -> IO()
run' g p | wins O g  = putStrLn "Player O wins"
         | wins X g  = putStrLn "Player X wins"
         | full g    = putStrLn "It's a draw" 
         | otherwise = do i <- getNat (prompt p)
                          case move g i p of
                             [] -> do putStrLn "ERROR: Invalid move"
                                      run' g p 
                             [g'] -> run g' (next p)
                             
data Tree a = Node a [Tree a] 
              deriving Show 

--              
gametree :: Grid -> Player -> Tree Grid 
gametree g p = Node g [gametree g' (next p) | g' <- moves g p]

-- move returns a list of grid could be empty if move is invalid 
moves :: Grid -> Player -> [Grid]
moves g p | won g = []
          | full g = []
          | otherwise = concat [move g i p | i <- [0..((size^2)-1)]]

prune:: Int -> Tree a -> Tree a 
prune 0 (Node x _)  = Node x []
prune n (Node x ts) = Node x [prune (n-1) t | t <- ts]      

depth :: Int
depth = 9

minimax :: Tree Grid -> Tree (Grid, Player)
minimax (Node g []) 
    | wins O g  = Node (g,O) []
    | wins X g  = Node (g,X) []
    | otherwise = Node (g,B) []    
minimax (Node g ts)
    | turn g == O = Node (g, minimum ps) ts'
    | turn g == X = Node (g, maximum ps) ts'
  where 
    ts'= map minimax ts 
    ps = [p | Node (_,p) _ <- ts'] 

bestmove :: Grid -> Player -> Grid 
bestmove g p = head [g'| Node (g',p') _ <- ts, p' == best]
  where 
    tree = prune depth (gametree g p)
    Node (_, best) ts = minimax tree 

main :: IO()
main = do hSetBuffering stdout NoBuffering
          play empty O 

play :: Grid -> Player -> IO()
play g p = do cls 
              goto (1,1)
              putGrid g
              play' g p 
              
play' :: Grid -> Player -> IO()
play' g p 
    | wins O g  = putStrLn "Player O wins"
    | wins X g  = putStrLn "Player X wins"
    | full g    = putStrLn "It's a draw" 
    | p == O    = do i <- getNat (prompt p) 
                     case move g i p of
                             [] -> do putStrLn "ERROR: Invalid move"
                                      play' g p 
                             [g'] -> play g' (next p)
    | p == X    = do putStr "Player X is thinking... "
                     if (firstMove g p) then 
                         play (randomMove g) (next p)
                     else 
                        (play $! (bestmove g p)) (next p)
                     
nodes :: Tree a -> Int 
nodes (Node _ ts) = 1 + sum (map nodes ts)

myDepth :: Tree a -> Int
myDepth (Node _ []) = 1
myDepth (Node _ ts) = 1 + maximum (map myDepth ts) 

firstMove :: Grid ->  Player -> Bool 
firstMove g p = not (any (==p) (concat g))

randomMove :: Grid -> Grid 
randomMove g | head (concat g) == O = concat (move g 4 X) 
             | otherwise            = concat (move g 0 X)


              
     
              