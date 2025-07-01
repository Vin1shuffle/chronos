# 📆 Chronos

**Chronos** é uma aplicação web para gerenciamento de lembretes e anotações com um calendário interativo. O projeto foi desenvolvido como parte de um trabalho acadêmico, com foco em simplicidade, usabilidade e segurança.

## 🚀 Funcionalidades

- Registro e login de usuários com autenticação JWT
- Criação, edição e exclusão de:
  - 📌 Lembretes por data
  - 📝 Notas gerais
- Visualização dos lembretes no calendário
- Painel lateral com agendamentos dos próximos 3 meses
- Interface responsiva com design temático outonal 🍂

## 🛠️ Tecnologias utilizadas

### Front-end
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Calendar](https://github.com/wojtekmaj/react-calendar)
- [Axios](https://axios-http.com/)
- [React Icons](https://react-icons.github.io/react-icons/)

### Back-end
- [Python 3](https://www.python.org/)
- [Flask](https://flask.palletsprojects.com/)
- [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/)
- [SQLite](https://www.sqlite.org/)

### Testes de API
- [Thunder Client](https://www.thunderclient.com/)

---

## 📦 Estrutura do Projeto

```
chronos/
├── backend/        → API Flask
│   ├── app.py
│   └── database.db
├── frontend/       → React App
│   ├── src/
│   └── public/
```

---

## 📂 Como rodar localmente

### 1. Backend (Flask)

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 Créditos

Desenvolvido por **Vinícius Casagrande** 🎓  


---

## 📃 Licença

Este projeto é de uso acadêmico, livre para fins educacionais.
