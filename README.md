# aniru

![Group 48095490](https://github.com/user-attachments/assets/c27cf2cf-561b-46dd-b806-baf0cbeed5e9)

It's not a commercial project.

[Preview](https://aniru-catalog.netlify.app/) (wait ~30 sec to enable server)

View layout in [Figma](https://www.figma.com/design/lTPrui95EflyKgOVOAYDVc/aniru?node-id=0-1&t=YzG5JdRsjJg11NfP-1) (not the final version, the layout was finalized during the development process)

##

#### Stack:

- [ReactJS](https://react.dev/)
- [ViteJS](https://vitejs.dev/)
- [SCSS](https://sass-scss.ru/)

**aniru** is an anime catalog where users can track and rate anime.

The project is at an early stage of development.

#### Implemented pages:
- Authorization and registration:
    - Input fields
    - Confirmation button
    - Page change button
- Main page:
    - List of anime in card format
    - Select to select a sort 
    - Modal window with filters
- Header:
    - Logo
    - Profile Button
    - Admin button (if you have a role)
    - A search field with a modal window
- Profile:
    - Avatar and user information
    - Favorite anime with pagination
    - Left reviews
- Anime page:
    - Poster and information about anime
    - Average rating
    - Left reviews
- Admin Panel:
    - CRUD for each table

It is planned to adding various categories for anime, anime collections, friend system, appearance improvement and optimization.

## Local Developing

### Frontend

1. Go to the client folder:
   ```bash
   cd clinet
   ```
   
2. Download all the necessary packages:
   ```bash
   npm install
   ```
   
3. Fix the problems:
   ```bash
   npm audit fix
   ```
   
4. Start the local server:
   ```bash
   npm run dev
   ```

5. To open website click Ctrl+LMB on link

### Backend

1. Go to the server folder:
   ```bash
   cd server
   ```
   
2. Download all the necessary packages:
   ```bash
   npm install
   ```
   
3. Fix the problems:
   ```bash
   npm audit fix
   ```
   
4. Start the local server:
   ```bash
   npm run dev
   ```

5. To open website click Ctrl+LMB on link
