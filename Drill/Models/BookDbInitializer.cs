using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Drill.Models
{
    public class BookDbInitializer : DropCreateDatabaseAlways<BookContext>
    {
        protected override void Seed(BookContext db)
        {
            db.Books.Add(new Book { Genre = "Биография",Readed = 1863 });
            db.Books.Add(new Book { Genre = "Фантастика",Readed = 1862 });
            db.Books.Add(new Book { Genre = "Роман",Readed = 1896 });

            base.Seed(db);
        }
    }
}