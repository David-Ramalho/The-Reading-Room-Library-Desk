(() => {
  const STORAGE_KEY = 'reading-room-library-v1';
  const palette = ['sage', 'cream', 'pink', 'blue', 'lilac', 'ochre'];
  const today = new Date();
  const dateOnly = (offset = 0) => { const d = new Date(); d.setDate(d.getDate() + offset); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const ago = (days) => dateOnly(-days);
  const sample = {
    books: [
      {id:'B-1001',title:'The Midnight Library',author:'Matt Haig',genre:'Fiction',year:2020,publisher:'Canongate',color:'sage'},
      {id:'B-1002',title:'Braiding Sweetgrass',author:'Robin Wall Kimmerer',genre:'Nature',year:2013,publisher:'Milkweed Editions',color:'cream'},
      {id:'B-1003',title:'Pachinko',author:'Min Jin Lee',genre:'Historical fiction',year:2017,publisher:'Grand Central',color:'pink'},
      {id:'B-1004',title:'The Creative Act',author:'Rick Rubin',genre:'Creativity',year:2023,publisher:'Penguin Press',color:'blue'},
      {id:'B-1005',title:'A Psalm for the Wild-Built',author:'Becky Chambers',genre:'Science fiction',year:2021,publisher:'Tor',color:'lilac'},
      {id:'B-1006',title:'Crying in H Mart',author:'Michelle Zauner',genre:'Memoir',year:2021,publisher:'Knopf',color:'ochre'},
      {id:'B-1007',title:'Small Things Like These',author:'Claire Keegan',genre:'Fiction',year:2021,publisher:'Grove Press',color:'sage'},
      {id:'B-1008',title:'The Art of Noticing',author:'Rob Walker',genre:'Creativity',year:2019,publisher:'Knopf',color:'cream'}
    ],
    members: [
      {id:'M-2041',name:'Avery Chen',email:'avery.chen@example.com',joined:ago(108),color:'sage'},
      {id:'M-2042',name:'Sofia Almeida',email:'sofia.almeida@example.com',joined:ago(87),color:'pink'},
      {id:'M-2043',name:'Noah Williams',email:'noah.williams@example.com',joined:ago(63),color:'gold'},
      {id:'M-2044',name:'Isabella Costa',email:'isabella.costa@example.com',joined:ago(41),color:'sage'},
      {id:'M-2045',name:'Leo Martins',email:'leo.martins@example.com',joined:ago(24),color:'pink'}
    ],
    loans: [
      {id:'L-3001',bookId:'B-1001',memberId:'M-2041',checkedOut:ago(8),dueDate:dateOnly(6),returnedAt:null},
      {id:'L-3002',bookId:'B-1003',memberId:'M-2042',checkedOut:ago(17),dueDate:dateOnly(-3),returnedAt:null},
      {id:'L-3003',bookId:'B-1006',memberId:'M-2043',checkedOut:ago(5),dueDate:dateOnly(9),returnedAt:null},
      {id:'L-3004',bookId:'B-1005',memberId:'M-2044',checkedOut:ago(13),dueDate:dateOnly(1),returnedAt:null},
      {id:'L-3005',bookId:'B-1002',memberId:'M-2045',checkedOut:ago(26),dueDate:ago(12),returnedAt:ago(11)}
    ]
  };

  let data = loadData();
  let activePage = 'overview';
  let activeLoanFilter = 'all';
  let toastTimer;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const bookById = (id) => data.books.find((book) => book.id === id);
  const memberById = (id) => data.members.find((member) => member.id === id);
  const isActive = (loan) => !loan.returnedAt;
  const activeLoanFor = (bookId) => data.loans.find((loan) => loan.bookId === bookId && isActive(loan));
  const isOverdue = (loan) => isActive(loan) && loan.dueDate < dateOnly();
  const initials = (name) => name.split(/\s+/).map((piece) => piece[0]).slice(0,2).join('').toUpperCase();

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.books) && Array.isArray(parsed.members) && Array.isArray(parsed.loans)) return parsed;
      }
    } catch (_) { /* Local-file browser privacy settings may block storage; the session still works. */ }
    return structuredClone(sample);
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch (_) { showToast('Changes are only saved for this browser session.'); }
  }
  function newId(prefix, rows) {
    let id;
    do { id = `${prefix}-${String(Math.floor(1000 + Math.random() * 9000))}`; }
    while (rows.some((row) => row.id === id));
    return id;
  }
  function prettyDate(iso) {
    if (!iso) return '—';
    const [y,m,d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat(undefined, {month:'short', day:'numeric', year:'numeric'}).format(new Date(y,m-1,d));
  }
  function statusFor(loan) {
    if (loan.returnedAt) return {label:'Returned',className:'returned'};
    if (isOverdue(loan)) return {label:'Overdue',className:'overdue'};
    if (loan.dueDate <= dateOnly(3)) return {label:'Due soon',className:'due-soon'};
    return {label:'On loan',className:'active'};
  }
  function showToast(message) {
    const node = $('#toast'); node.textContent = message; node.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove('show'), 2600);
  }
  function setPage(page) {
    activePage = page;
    $$('.page').forEach((node) => node.classList.toggle('active-page', node.id === `page-${page}`));
    $$('.nav-item').forEach((node) => node.classList.toggle('active', node.dataset.page === page));
    const labels = {overview:'Overview',catalog:'Book catalog',loans:'Loans',members:'Members'};
    $('#current-crumb').textContent = labels[page] || 'Overview';
    render();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function render() { renderDashboard(); renderCatalog(); renderLoans(); renderMembers(); $('#nav-book-count').textContent = data.books.length; }
  function renderDashboard() {
    const checkedOut = data.loans.filter(isActive).length;
    const overdue = data.loans.filter(isOverdue).length;
    const cards = [
      ['Books on the shelves',data.books.length,'Titles in the collection','▤'],
      ['Lovely readers',data.members.length,'Active library members','♙'],
      ['Out exploring',checkedOut,'Books currently on loan','↗'],
      ['Ready for a nudge',overdue,'Books that are past due','☼']
    ];
    $('#stats-grid').innerHTML = cards.map(([label,value,caption,symbol]) => `<article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-symbol">${symbol}</span></div><div class="stat-value">${value}</div><div class="stat-caption">${caption}</div></article>`).join('');
    $('#available-count').textContent = data.books.filter((book) => !activeLoanFor(book.id)).length;
    const recent = [...data.loans].sort((a,b) => b.checkedOut.localeCompare(a.checkedOut)).slice(0,4);
    $('#recent-loans').innerHTML = recent.map((loan) => loanRow(loan,false)).join('');
    $('#empty-recent').classList.toggle('hidden',recent.length > 0);
    const available = data.books.filter((book) => !activeLoanFor(book.id)).slice(0,5);
    $('#mini-books').innerHTML = available.length ? available.map((book) => `<span class="mini-book" title="${esc(book.title)}" aria-label="${esc(book.title)}"></span>`).join('') : '<span class="mini-note">The shelves are ready for new arrivals.</span>';
    const date = new Intl.DateTimeFormat(undefined,{weekday:'long',month:'long',day:'numeric'}).format(new Date());
    $('#today-label').textContent = date.toUpperCase();
    $('#footer-year').textContent = new Date().getFullYear();
  }
  function bookCell(book) {
    if (!book) return '<div class="book-cell"><span class="book-thumb">?</span><span class="book-title">Book removed</span></div>';
    return `<div class="book-cell"><span class="book-thumb ${esc(book.color)}">✳</span><span><span class="book-title">${esc(book.title)}</span><span class="book-author">${esc(book.author)}</span></span></div>`;
  }
  function loanRow(loan, withAction = true) {
    const book = bookById(loan.bookId), member = memberById(loan.memberId), status = statusFor(loan);
    const action = withAction ? (isActive(loan) ? `<button class="mini-action" data-action="return" data-id="${esc(loan.id)}">Return book</button>` : '<span class="member-cell">—</span>') : '';
    return `<tr><td>${bookCell(book)}</td><td class="member-cell">${esc(member?.name || 'Member removed')}</td><td>${prettyDate(loan.checkedOut)}</td><td>${prettyDate(loan.dueDate)}</td><td><span class="status ${status.className}">${status.label}</span></td>${withAction ? `<td>${action}</td>` : ''}</tr>`;
  }
  function renderCatalog() {
    if (!$('#catalog-grid')) return;
    const query = ($('#catalog-search')?.value || '').trim().toLowerCase();
    const filter = $('#book-filter')?.value || 'all';
    const sort = $('#book-sort')?.value || 'title';
    let books = data.books.filter((book) => `${book.title} ${book.author} ${book.genre} ${book.publisher} ${book.id}`.toLowerCase().includes(query));
    books = books.filter((book) => filter === 'all' || (filter === 'available' ? !activeLoanFor(book.id) : !!activeLoanFor(book.id)));
    books.sort((a,b) => sort === 'author' ? a.author.localeCompare(b.author) : sort === 'year-new' ? b.year-a.year : sort === 'year-old' ? a.year-b.year : a.title.localeCompare(b.title));
    $('#catalog-grid').innerHTML = books.map((book) => {
      const loan = activeLoanFor(book.id);
      return `<article class="catalog-card"><div class="cover ${esc(book.color)}"><span>${esc(book.title)}</span></div><div class="card-details"><h3>${esc(book.title)}</h3><p class="card-author">by ${esc(book.author)}</p><div class="card-meta"><span class="genre-tag">${esc(book.genre)}</span><span class="year-tag">${esc(book.year)}</span></div><div class="card-status"><span class="status ${loan ? 'active':'available'}">${loan ? 'Checked out':'Available'}</span></div><div class="card-actions"><button class="mini-action" data-action="edit-book" data-id="${esc(book.id)}">Edit</button>${loan ? `<button class="mini-action" data-action="return" data-id="${esc(loan.id)}">Return</button>` : `<button class="mini-action" data-action="checkout-book" data-id="${esc(book.id)}">Check out</button>`}<button class="mini-action" data-action="delete-book" data-id="${esc(book.id)}" aria-label="Delete ${esc(book.title)}">Delete</button></div></div></article>`;
    }).join('');
    $('#empty-catalog').classList.toggle('hidden', books.length > 0);
  }
  function renderLoans() {
    if (!$('#loans-table')) return;
    const query = ($('#loan-search')?.value || '').trim().toLowerCase();
    const loans = [...data.loans].filter((loan) => {
      const status = activeLoanFilter === 'all' || (activeLoanFilter === 'active' && isActive(loan)) || (activeLoanFilter === 'overdue' && isOverdue(loan)) || (activeLoanFilter === 'returned' && !!loan.returnedAt);
      const matches = `${bookById(loan.bookId)?.title || ''} ${memberById(loan.memberId)?.name || ''}`.toLowerCase().includes(query);
      return status && matches;
    }).sort((a,b) => b.checkedOut.localeCompare(a.checkedOut));
    $('#loans-table').innerHTML = loans.map((loan) => loanRow(loan,true)).join('');
    $('#empty-loans').classList.toggle('hidden', loans.length > 0);
  }
  function renderMembers() {
    if (!$('#members-grid')) return;
    const query = ($('#member-search')?.value || '').trim().toLowerCase();
    const members = data.members.filter((member) => `${member.name} ${member.email} ${member.id}`.toLowerCase().includes(query)).sort((a,b) => a.name.localeCompare(b.name));
    $('#members-grid').innerHTML = members.map((member) => {
      const loans = data.loans.filter((loan) => loan.memberId === member.id && isActive(loan));
      return `<article class="member-card"><div class="member-card-top"><div class="member-avatar ${esc(member.color)}">${esc(initials(member.name))}</div><div><div class="member-name">${esc(member.name)}</div><div class="member-email">${esc(member.email)}</div></div></div><div class="member-card-bottom"><span>Member since <strong>${prettyDate(member.joined)}</strong></span><span><strong>${loans.length}</strong> book${loans.length === 1 ? '' : 's'} out</span></div><div class="member-card-actions"><button class="mini-action" data-action="edit-member" data-id="${esc(member.id)}">Edit details</button><button class="mini-action" data-action="delete-member" data-id="${esc(member.id)}">Remove</button></div></article>`;
    }).join('');
    $('#member-count-label').textContent = `${members.length} ${members.length === 1 ? 'reader':'readers'}`;
    $('#empty-members').classList.toggle('hidden', members.length > 0);
  }

  function openModal({title,copy,fields,submitLabel='Save changes',onSubmit}) {
    $('#modal-title').textContent = title; $('#modal-copy').textContent = copy;
    const form = $('#modal-form');
    form.innerHTML = `<div class="form-grid">${fields}<div class="form-error" id="form-error" aria-live="polite"></div><div class="form-actions"><button type="button" class="button button-secondary" id="cancel-modal">Cancel</button><button type="submit" class="button button-primary">${submitLabel}</button></div></div>`;
    $('#modal-backdrop').classList.remove('hidden');
    $('#cancel-modal').addEventListener('click',closeModal);
    form.onsubmit = (event) => { event.preventDefault(); const result = onSubmit(new FormData(form)); if (result !== false) closeModal(); };
    setTimeout(() => $('input,select',form)?.focus(),30);
  }
  function field(label,name,{value='',type='text',placeholder='',required=true,options=null,full=false,min=null,max=null}={}) {
    const control = options ? `<select name="${name}" ${required?'required':''}>${options.map(([v,l])=>`<option value="${esc(v)}" ${String(v)===String(value)?'selected':''}>${esc(l)}</option>`).join('')}</select>` : `<input name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${required?'required':''} ${min!==null?`min="${min}"`:''} ${max!==null?`max="${max}"`:''}>`;
    return `<div class="field ${full?'full':''}"><label for="field-${name}">${esc(label)}</label>${control.replace(`name="${name}"`,`id="field-${name}" name="${name}"`)}</div>`;
  }
  function formError(message) { $('#form-error').textContent = message; return false; }
  function closeModal() { $('#modal-backdrop').classList.add('hidden'); $('#modal-form').onsubmit = null; }
  function addBook(existing=null) {
    const editing = !!existing;
    openModal({title:editing?'Edit book':'Add a book',copy:editing?'Update the details on this shelf card.':'Put another good story on the shelves.',submitLabel:editing?'Save book':'Add to catalog',fields:[
      field('Title','title',{value:existing?.title||'',placeholder:'e.g. The Secret Garden',full:true}),
      field('Author','author',{value:existing?.author||'',placeholder:'Author name'}),
      field('Genre','genre',{value:existing?.genre||'',placeholder:'Fiction, history…'}),
      field('Publication year','year',{value:existing?.year||new Date().getFullYear(),type:'number',min:0,max:2100}),
      field('Publisher','publisher',{value:existing?.publisher||'',required:false,placeholder:'Publisher'}),
    ].join(''),onSubmit:(form)=>{
      const title=String(form.get('title')).trim(),author=String(form.get('author')).trim(),year=Number(form.get('year'));
      if(!title||!author) return formError('Please add both a title and an author.');
      if(!Number.isInteger(year)||year<0||year>2100) return formError('Enter a valid publication year.');
      const duplicate=data.books.some((book)=>book.title.toLowerCase()===title.toLowerCase()&&book.id!==existing?.id);
      if(duplicate) return formError('That title is already in the catalog.');
      const values={title,author,genre:String(form.get('genre')).trim()||'Uncategorized',year,publisher:String(form.get('publisher')).trim(),color:existing?.color||palette[data.books.length%palette.length]};
      if(existing) Object.assign(existing,values); else data.books.push({id:newId('B',data.books),...values});
      save();render();showToast(existing?'Book details updated.':'A new story joined the shelves.');
    }});
  }
  function addMember(existing=null) {
    const editing=!!existing;
    openModal({title:editing?'Edit member':'Welcome a new reader',copy:editing?'Keep this reader’s details up to date.':'Add someone to the library community.',submitLabel:editing?'Save member':'Add member',fields:[
      field('Full name','name',{value:existing?.name||'',placeholder:'Reader name',full:true}),
      field('Email address','email',{value:existing?.email||'',type:'email',placeholder:'reader@example.com',full:true}),
    ].join(''),onSubmit:(form)=>{
      const name=String(form.get('name')).trim(),email=String(form.get('email')).trim();
      if(!name) return formError('Please add the member’s name.');
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return formError('Enter a valid email address.');
      if(data.members.some((member)=>member.email.toLowerCase()===email.toLowerCase()&&member.id!==existing?.id)) return formError('That email address is already registered.');
      const values={name,email,color:existing?.color||['sage','pink','gold'][data.members.length%3]};
      if(existing) Object.assign(existing,values); else data.members.push({id:newId('M',data.members),joined:dateOnly(),...values});
      save();render();showToast(existing?'Member details updated.':'A new reader joined the library.');
    }});
  }
  function checkout(bookId=null) {
    const available=data.books.filter((book)=>!activeLoanFor(book.id));
    if(!available.length) { showToast('Every book is out exploring right now.'); return; }
    if(!data.members.length) { showToast('Add a member before checking out a book.'); setPage('members'); return; }
    const bookOptions=available.map((book)=>[book.id,`${book.title} — ${book.author}`]);
    const memberOptions=data.members.slice().sort((a,b)=>a.name.localeCompare(b.name)).map((member)=>[member.id,member.name]);
    openModal({title:'Check out a book',copy:'Send a story on its way to a new reader.',submitLabel:'Complete checkout',fields:[
      field('Choose a book','bookId',{value:bookId||available[0].id,options:bookOptions,full:true}),
      field('Choose a member','memberId',{value:memberOptions[0][0],options:memberOptions,full:true}),
      field('Due back','dueDate',{value:dateOnly(14),type:'date',min:dateOnly(1),full:true}),
    ].join(''),onSubmit:(form)=>{
      const bookId=String(form.get('bookId')),memberId=String(form.get('memberId')),dueDate=String(form.get('dueDate'));
      if(!bookById(bookId)||activeLoanFor(bookId)) return formError('That book is no longer available. Please choose another.');
      if(!memberById(memberId)) return formError('Please choose a current library member.');
      if(!dueDate||dueDate<=dateOnly()) return formError('The due date must be after today.');
      data.loans.push({id:newId('L',data.loans),bookId,memberId,checkedOut:dateOnly(),dueDate,returnedAt:null});
      save();render();showToast('Checkout complete. Happy reading!');
    }});
  }
  function returnLoan(id) {
    const loan=data.loans.find((item)=>item.id===id);
    if(!loan||!isActive(loan)) return;
    loan.returnedAt=dateOnly();save();render();showToast(`${bookById(loan.bookId)?.title||'Book'} is back on the shelf.`);
  }
  function removeBook(id) {
    const book=bookById(id);if(!book)return;
    if(activeLoanFor(id)){showToast('Return this book before removing it from the catalog.');return;}
    if(!window.confirm(`Remove “${book.title}” from the catalog?`))return;
    data.books=data.books.filter((item)=>item.id!==id);save();render();showToast('Book removed from the catalog.');
  }
  function removeMember(id) {
    const member=memberById(id);if(!member)return;
    if(data.loans.some((loan)=>loan.memberId===id&&isActive(loan))){showToast('This reader has a book out. Record its return first.');return;}
    if(!window.confirm(`Remove ${member.name} from library members?`))return;
    data.members=data.members.filter((item)=>item.id!==id);save();render();showToast('Member removed.');
  }
  function exportBackup() {
    const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),...data},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='reading-room-backup.json';a.click();URL.revokeObjectURL(url);showToast('Library backup downloaded.');
  }
  function restoreDemo() {
    if(!window.confirm('Restore the original sample books, members, and loans? Your current browser data will be replaced.')) return;
    data=structuredClone(sample);save();
    ['catalog-search','member-search','loan-search','global-search'].forEach((id)=>{const input=$('#'+id);if(input)input.value='';});
    $('#book-filter').value='all';$('#book-sort').value='title';activeLoanFilter='all';$$('.pill','#loan-filters').forEach((node)=>node.classList.toggle('active',node.dataset.filter==='all'));
    render();setPage('overview');showToast('Demo shelves restored.');
  }
  function globalSearch(value) {
    const query=value.trim().toLowerCase();if(!query)return;
    const bookMatch=data.books.some((book)=>`${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(query));
    setPage(bookMatch?'catalog':'members');
    const target=bookMatch?$('#catalog-search'):$('#member-search');target.value=value;target.dispatchEvent(new Event('input',{bubbles:true}));
  }

  document.addEventListener('click',(event)=>{
    const page=event.target.closest('[data-page]');if(page){event.preventDefault();setPage(page.dataset.page);return;}
    const action=event.target.closest('[data-action]');if(!action)return;
    const {action:kind,id}=action.dataset;
    if(kind==='add-book')addBook();if(kind==='edit-book')addBook(bookById(id));if(kind==='delete-book')removeBook(id);
    if(kind==='add-member')addMember();if(kind==='edit-member')addMember(memberById(id));if(kind==='delete-member')removeMember(id);
    if(kind==='checkout')checkout();if(kind==='checkout-book')checkout(id);if(kind==='return')returnLoan(id);
    if(kind==='reset-demo')restoreDemo();
  });
  $('#loan-filters').addEventListener('click',(event)=>{const pill=event.target.closest('[data-filter]');if(!pill)return;activeLoanFilter=pill.dataset.filter;$$('.pill','#loan-filters').forEach((node)=>node.classList.toggle('active',node===pill));renderLoans();});
  ['catalog-search','book-filter','book-sort'].forEach((id)=>$('#'+id).addEventListener('input',renderCatalog));
  ['loan-search'].forEach((id)=>$('#'+id).addEventListener('input',renderLoans));
  ['member-search'].forEach((id)=>$('#'+id).addEventListener('input',renderMembers));
  $('#global-search').addEventListener('keydown',(event)=>{if(event.key==='Enter')globalSearch(event.currentTarget.value);});
  $('#global-search').addEventListener('input',(event)=>{if(!event.target.value){if(activePage==='catalog')renderCatalog();if(activePage==='members')renderMembers();}});
  document.addEventListener('keydown',(event)=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();$('#global-search').focus();}if(event.key==='Escape')closeModal();});
  $('#export-button').addEventListener('click',exportBackup);
  $('#modal-close').addEventListener('click',closeModal);
  $('#modal-backdrop').addEventListener('click',(event)=>{if(event.target.id==='modal-backdrop')closeModal();});
  render();
})();

